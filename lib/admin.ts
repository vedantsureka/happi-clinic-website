/** The admin is available in development, or in production once GitHub storage is configured. */
export function adminEnabled(): boolean {
  return process.env.NODE_ENV !== "production" || Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO);
}
