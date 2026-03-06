
import type {
  IUser,
  ILoginRequest,
  IAuthResponse,
  IVerifyTokenRequest,
  IVerifyTokenResponse,
  IResetPasswordRequest,
  IResetPasswordResponse,
  IChangePasswordRequest,
  IForgotPasswordRequest,
  IChangePasswordResponse,
  IForgotPasswordResponse,
} from "@/types/authTypes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Secret key for JWT (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const TOKEN_EXPIRY = "7d"; // 7 days

// Helper function to generate JWT
function generateToken(user: IUser): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

// Helper function to hash password
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Helper function to verify password
async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ========================================
// 1. LOGIN ENDPOINT
// ========================================

import type { TAuthRequest, TDatabase } from "../types/types";
import type { Application, Request, Response } from "express";

export function hrmsAUTH_ENDPOINTS(
  server: Application,
  getDb: () => TDatabase,
  saveDb: (db: TDatabase) => void,
) {

  server.post("/api/auth/login", async (req: Request, res: Response) => {
    const db = getDb();
    const { email, password, role, rememberMe } = req.body as ILoginRequest;

    // Validation
    if (!email || !password || !role) {
      res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
      return;
    }

    // Find user by email
    const user = db.users?.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Verify password (in production, use bcrypt)
    // For demo purposes, we'll use plain text comparison
    const passwordMatch = user.passwordHash === password; // Replace with: await verifyPassword(password, user.password)

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Check if user role matches
    if (user.role !== role) {
      res.status(403).json({
        success: false,
        message: `This account is not authorized to login as ${role}`,
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact HR.",
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    saveDb(db);

    // Generate JWT token
    const token = generateToken(user);
    const expiresIn = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7 days or 1 day

    // Remove password from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    const response: IAuthResponse = {
      success: true,
      message: "Login successful",
      user: userWithoutPassword as IUser,
      token,
      expiresIn,
    };

    res.json(response);
  });

  // ========================================
  // 2. LOGOUT ENDPOINT
  // ========================================

  server.post("/api/auth/logout", (_req: TAuthRequest, res: Response) => {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return success
    res.json({
      success: true,
      message: "Logout successful",
    });
  });

  // ========================================
  // 3. VERIFY TOKEN ENDPOINT
  // ========================================

  server.post("/api/auth/verify", (req: Request, res: Response) => {
    const { token } = req.body as IVerifyTokenRequest;

    if (!token) {
      res.status(400).json({
        valid: false,
        message: "Token is required",
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const db = getDb();

      // Find user
      const user = db.users?.find((u) => u.id === decoded.userId);

      if (!user || !user.isActive) {
        res.json({ valid: false });
        return;
      }

      // Remove password from response
      const { passwordHash: _, ...userWithoutPassword } = user;

      const response: IVerifyTokenResponse = {
        valid: true,
        user: userWithoutPassword as IUser,
      };

      res.json(response);
    } catch (error) {
      res.json({ valid: false });
    }
  });

  // ========================================
  // 4. FORGOT PASSWORD ENDPOINT
  // ========================================

  server.post("/api/auth/forgot-password", (req: Request, res: Response) => {
    const db = getDb();
    const { email } = req.body as IForgotPasswordRequest;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
      return;
    }

    // Find user
    const user = db.users?.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    // Always return success for security (don't reveal if email exists)
    const response: IForgotPasswordResponse = {
      success: true,
      message:
        "If an account exists with this email, you will receive password reset instructions.",
    };

    if (user) {
      // Generate reset token
      const resetToken = generateToken(user);

      // Store reset token (in production, store in database with expiry)
      if (!db.passwordResets) {
        db.passwordResets = [];
      }

      db.passwordResets.push({
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
        createdAt: new Date().toISOString(),
      });

      saveDb(db);

      // In production, send email with reset link
      console.log(`Password reset token for ${email}: ${resetToken}`);
    }

    res.json(response);
  });

  // ========================================
  // 5. RESET PASSWORD ENDPOINT
  // ========================================

  server.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    const db = getDb();
    const { token, newPassword, confirmPassword } =
      req.body as IResetPasswordRequest;

    // Validation
    if (!token || !newPassword || !confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Token, new password, and confirm password are required",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
      return;
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // Find reset token in database
      const resetRecord = db.passwordResets?.find(
        (r) => r.token === token && r.userId === decoded.userId
      );

      if (!resetRecord) {
        res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
        return;
      }

      // Check if token has expired
      if (new Date(resetRecord.expiresAt) < new Date()) {
        res.status(400).json({
          success: false,
          message: "Reset token has expired",
        });
        return;
      }

      // Find user
      const user = db.users?.find((u) => u.id === decoded.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      // Update password (in production, hash the password)
      user.passwordHash = newPassword; // Replace with: await hashPassword(newPassword)

      // Remove used reset token
      db.passwordResets = db.passwordResets?.filter((r) => r.token !== token);

      saveDb(db);

      const response: IResetPasswordResponse = {
        success: true,
        message: "Password reset successful. You can now login with your new password.",
      };

      res.json(response);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }
  });

  // ========================================
  // 6. CHANGE PASSWORD ENDPOINT (Authenticated)
  // ========================================

  server.post(
    "/api/auth/change-password",
    (req: TAuthRequest, res: Response) => {
      const db = getDb();
      const { currentPassword, newPassword, confirmPassword } =
        req.body as IChangePasswordRequest;

      // Validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        res.status(400).json({
          success: false,
          message: "Current password, new password, and confirm password are required",
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        res.status(400).json({
          success: false,
          message: "New passwords do not match",
        });
        return;
      }

      if (newPassword.length < 8) {
        res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long",
        });
        return;
      }

      // Find user
      const user = db.users?.find((u) => u.id === req.user?.staffId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      // Verify current password
      const passwordMatch = user.passwordHash === currentPassword; // Replace with: await verifyPassword(currentPassword, user.password)

      if (!passwordMatch) {
        res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
        return;
      }

      // Update password
      user.passwordHash = newPassword; // Replace with: await hashPassword(newPassword)

      saveDb(db);

      const response: IChangePasswordResponse = {
        success: true,
        message: "Password changed successfully",
      };

      res.json(response);
    }
  );

  // ========================================
  // 7. GET CURRENT USER ENDPOINT
  // ========================================

  server.get("/api/auth/me", (req: TAuthRequest, res: Response) => {
    const db = getDb();

    // Get user from request (set by auth middleware)
    const user = db.users?.find((u) => u.id === req.user?.staffId);

    if (!user || !user.isActive) {
      res.status(404).json({
        success: false,
        message: "User not found or inactive",
      });
      return;
    }

    // Remove password from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  });
}
