/**
 * tRPC Middleware Barrel Export
 *
 * Centralized export for all tRPC middleware functions.
 * Provides authentication, authorization, and row-level security.
 */

// Role-Based Access Control (RBAC)
export { enforceUserIsAuthed, enforceUserIsAdmin, adminProcedure } from './role-check';

// Row-Level Security (RLS)
export { enforceResourceOwnership, enforceUserIdMatch, enforceOwnershipViaDb } from './owner-check';
