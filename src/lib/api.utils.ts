import { QueryClient } from "@tanstack/react-query";
import type { TResponseType } from "@/types/responseType";
import type { ErrorResponseType } from "@/types/errorResponseType";

// ── Types ──────────────────────────────────────────────────────────────────

export class ApiError extends Error implements ErrorResponseType {
  errorTitle: string;
  errorMessage: string;
  errorCode: number;

  constructor(err: ErrorResponseType) {
    super(err.errorMessage);
    this.name = "ApiError";
    this.errorCode = err.errorCode;
    this.errorTitle = err.errorTitle;
    this.errorMessage = err.errorMessage;
  }
}

// ── Token storage ──────────────────────────────────────────────────────────

const ACCESS_KEY = "auth_token";
const REFRESH_KEY = "refresh_token";

export const tokens = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setAccess: (token: string) => localStorage.setItem(ACCESS_KEY, token),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ── Refresh queue ──────────────────────────────────────────────────────────
// Holds callers that arrived while a refresh was already in-flight so they
// wait for one shared refresh rather than each firing their own.

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  refreshQueue.forEach((entry) =>
    error ? entry.reject(error) : entry.resolve(token!),
  );
  refreshQueue = [];
}

// ── Refresh logic ──────────────────────────────────────────────────────────

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokens.getRefresh();
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await fetch(`api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new ApiError({
      errorCode: response.status,
      errorTitle: "Session Expired",
      errorMessage: "Your session has expired. Please log in again.",
    });
  }

  const data = await response.json();
  tokens.set(data.accessToken, data.refreshToken);
  return data.accessToken;
}

// ── Core fetch helper ──────────────────────────────────────────────────────

function buildHeaders(token: string | null, init: RequestInit): Headers {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (
    init.method !== "DELETE" &&
    !headers.has("Content-Type") &&
    !(init.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");
  return headers;
}

async function parseErrorResponse(
  response: Response,
  input: RequestInfo | URL,
): Promise<ApiError> {
  let serverError: ErrorResponseType;
  try {
    serverError = JSON.parse(await response.text()) as ErrorResponseType;
    if (
      typeof serverError.errorCode !== "number" ||
      typeof serverError.errorTitle !== "string" ||
      typeof serverError.errorMessage !== "string"
    ) {
      throw new Error("malformed");
    }
  } catch {
    serverError = {
      errorCode: response.status,
      errorTitle: response.statusText || "Request Failed",
      errorMessage: `HTTP ${response.status} — ${response.url ?? String(input)}`,
    };
  }
  return new ApiError(serverError);
}

// ── apiFetch ───────────────────────────────────────────────────────────────

export async function apiFetch<T = unknown>(
  input: RequestInfo | URL,
  init: RequestInit = {},
  _isRetry = false, // internal flag — prevents infinite retry loops
): Promise<T> {
  const token = tokens.getAccess();
  const headers = buildHeaders(token, init);
  const response = await fetch(input, { ...init, headers });

  // ── Happy path ─────────────────────────────────────────────────────────
  if (response.ok) {
    if (response.status === 204) return null as T;
    const body = (await response.json()) as TResponseType<T>;
    return body.payload ?? (body as T);
  }

  // ── 401 handling ───────────────────────────────────────────────────────
  if (response.status === 401 && !_isRetry) {
    // If a refresh is already running, queue this request and wait for it
    if (isRefreshing) {
      await new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      });
      // Retry once with the token we got from the queue
      return apiFetch<T>(input, init, true);
    }

    // We're the first — own the refresh
    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      // Retry the original request with the new token
      return apiFetch<T>(input, init, true);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokens.clear();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  // ── All other errors ───────────────────────────────────────────────────
  throw await parseErrorResponse(response, input);
}

// ── QueryClient ────────────────────────────────────────────────────────────

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError) {
          const code = error.errorCode;
          if (code >= 400 && code < 500) return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

export async function invalidateQueries(queryKeys: string[]) {
  await Promise.all(
    queryKeys.map((q) =>
      queryClient.invalidateQueries({ queryKey: [q], refetchType: "all" }),
    ),
  );
}
