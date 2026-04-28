import { QueryClient } from "@tanstack/react-query";
import type { TResponseType } from "@/types/responseType";
import type { ErrorResponseType } from "@/types/errorResponseType";

// ── Types ──────────────────────────────────────────────────────────────────

// Typed error class so callers can do: catch (e) { if (e instanceof ApiError) }
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

// ── Token accessor ─────────────────────────────────────────────────────────
function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export async function invalidateQueries(queryKeys: string[]) {
  await Promise.all(
    queryKeys.map((q) =>
      queryClient.invalidateQueries({ queryKey: [q], refetchType: "all" }),
    ),
  );
}

// ── apiFetch ───────────────────────────────────────────────────────────────
// Returns T (unwrapped from the server envelope) so useSuspenseQuery,
// useSuspenseInfiniteQuery etc. receive the exact type they declare.
//
// On any non-ok response it parses the server's ErrorResponseType body and
// throws an ApiError — which means error.errorCode drives the retry logic
// below instead of a raw status field.
export async function apiFetch<T = unknown>(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(init.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (
    init.method != "DELETE" &&
    !headers.has("Content-Type") &&
    !(init.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");

  const response = await fetch(input, { ...init, headers });

  // ── Error path — parse server ErrorResponseType ────────────────────────
  if (!response.ok) {
    let serverError: ErrorResponseType;
    try {
      // Server should return { errorTitle, errorMessage, errorCode }
      serverError = JSON.parse(await response.text()) as ErrorResponseType;

      // Guard against malformed responses that don't match the shape
      if (
        typeof serverError.errorCode !== "number" ||
        typeof serverError.errorTitle !== "string" ||
        typeof serverError.errorMessage !== "string"
      ) {
        throw new Error("malformed");
      }
    } catch {
      // Server returned non-JSON or unexpected shape — synthesise the fields
      serverError = {
        errorCode: response.status,
        errorTitle: response.statusText || "Request Failed",
        errorMessage: `HTTP ${response.status} — ${response.url ?? String(input)}`,
      };
    }

    throw new ApiError(serverError);
  }

  // 204 No Content — nothing to parse
  if (response.status === 204) return null as T;

  // ── Success path — unwrap envelope so suspense queries get T directly ──
  const body = (await response.json()) as TResponseType<T>;
  return body.payload ?? (body as T);
}

// ── QueryClient ────────────────────────────────────────────────────────────
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        // ApiError carries errorCode — no retry for 4xx client errors
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
