import { NextResponse } from "next/server";

/** A redirect must carry refreshed auth cookies back to the browser too. */
export function redirectWithSession(destination: URL, sessionResponse: NextResponse) {
  const response = NextResponse.redirect(destination);
  for (const cookie of sessionResponse.cookies.getAll()) response.cookies.set(cookie);
  // Never cache a redirect that depends on the current user's identity.
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
