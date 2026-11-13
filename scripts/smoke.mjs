import assert from "node:assert/strict";
const base = process.env.SMOKE_URL ?? "http://127.0.0.1:3000";
for (const path of ["/en/app/teacher", "/en/teacher-dashboard", "/en/app/student", "/en/admin"]) {
  const response = await fetch(base + path, { redirect: "manual" });
  assert.equal(response.status, 307, path);
  assert.match(response.headers.get("location"), /\/en\/login/);
}
for (const [path, status] of [["/api/profile", 401], ["/api/learning", 401], ["/api/admin/experiments", 403], ["/api/notebook", 401], ["/api/notebook/teacher", 401], ["/api/notebook/teacher/shared", 401], ["/api/teacher/reports", 403]]) {
  assert.equal((await fetch(base + path)).status, status, path);
}
for (const query of ["", "?limit=invalid"]) {
  const response = await fetch(base + "/api/recommendations" + query);
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.isColdStart, true);
  assert.equal(result.recommendations.length, 3);
  assert.ok(!JSON.stringify(result).includes('"isCorrect"'));
}
const answer = await fetch(base + "/api/quiz/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ experimentSlug: "red-cabbage-ph-indicator", questionId: "q1", selectedOptionId: "b" }) });
assert.equal(answer.status, 200);
assert.equal((await answer.json()).response.isCorrect, true);
const invalid = await fetch(base + "/api/quiz/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ experimentSlug: "red-cabbage-ph-indicator", questionId: "missing", selectedOptionId: "b" }) });
assert.equal(invalid.status, 404);
console.log("PASS: anonymous authorization, recommendation API, public answer privacy, and server answer validation.");
