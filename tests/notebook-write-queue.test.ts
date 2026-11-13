import test from "node:test";
import assert from "node:assert/strict";
import { createWriteQueue } from "../src/features/notebook/write-queue";

test("slow autosaves cannot overwrite newer edits; failed saves do not block recovery", async () => {
  const enqueue = createWriteQueue();
  const writes: string[] = [];
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const first = enqueue(async () => { await gate; writes.push("old"); });
  const second = enqueue(async () => { writes.push("new"); });
  await Promise.resolve();
  assert.equal(writes.length, 0);
  release();
  await Promise.all([first, second]);
  assert.equal(writes.join(","), "old,new");
  await assert.rejects(enqueue(async () => { throw new Error("offline"); }), /offline/);
  await enqueue(async () => { writes.push("recovered"); });
  assert.equal(writes.at(-1), "recovered");
});
