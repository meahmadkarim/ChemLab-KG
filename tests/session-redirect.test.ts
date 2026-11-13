import test from "node:test";
import assert from "node:assert/strict";
import { NextResponse } from "next/server";
import { redirectWithSession } from "../src/lib/supabase/redirect";

test("workspace redirects preserve rotated and expired session cookies", () => {
  const session = NextResponse.next();
  session.cookies.set("session.0", "rotated-test-token", { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
  session.cookies.set("session.1", "", { maxAge: 0, path: "/" });
  const result = redirectWithSession(new URL("https://example.test/en/me"), session);
  assert.equal(result.status, 307);
  assert.equal(result.headers.get("location"), "https://example.test/en/me");
  assert.deepEqual(result.cookies.getAll(), session.cookies.getAll());
  assert.equal(result.headers.get("cache-control"), "private, no-store");
});
