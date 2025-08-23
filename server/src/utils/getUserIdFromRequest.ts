// src/utils/getUserIdFromRequest.ts
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

/**
 * Extracts the user ID from the JWT payload in the request.
 * Assumes JWT was decoded in middleware and attached to req.user.
 */
export function getUserIdFromRequest(req: Request): string {
  const user = req.user as JwtPayload;

  if (!user || typeof user !== "object" || !user.id) {
    throw new Error("Invalid token payload or user ID not found");
  }

  return user.id;
}
