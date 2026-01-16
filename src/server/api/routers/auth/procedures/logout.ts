/**
 * Logout procedure
 *
 * Logs out the authenticated user.
 * - Requires authentication (protectedProcedure)
 * - Returns success message
 *
 * Note: NextAuth handles actual session clearing via its own middleware.
 * This procedure confirms the logout action and can be extended for
 * additional cleanup (e.g., logging, analytics, clearing refresh tokens).
 */

/**
 * Logout response
 */
export interface LogoutResponse {
  success: boolean;
  message: string;
}

/**
 * Logout user
 *
 * @param _userId - ID of the authenticated user (reserved for future use)
 * @returns Success message
 */
export async function logoutUser(_userId: string): Promise<LogoutResponse> {
  // Future: Add any cleanup logic here
  // - Log logout event (using _userId)
  // - Clear refresh tokens
  // - Clear cached data
  // - Send analytics event

  return {
    success: true,
    message: 'Logged out successfully',
  };
}
