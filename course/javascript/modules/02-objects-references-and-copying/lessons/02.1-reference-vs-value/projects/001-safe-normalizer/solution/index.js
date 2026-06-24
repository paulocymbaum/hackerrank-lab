// Reference solution (optional). Keep starter as the primary deliverable.

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });
}

function fail(message) {
  process.stdout.write(`ERROR: ${message}\n`);
}

function assertObject(value, name) {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${name} must be an object`);
  }
}

function normalizeUserId(userId) {
  const n = typeof userId === "number" ? userId : Number(userId);
  if (!Number.isFinite(n) || !Number.isInteger(n)) throw new Error("userId must be an integer");
  return n;
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) throw new Error("tags must be an array");
  return tags
    .map((t) => (t == null ? "" : String(t)).trim().toLowerCase())
    .filter((t) => t.length > 0);
}

function normalizeAge(age) {
  if (age == null) return null;
  if (typeof age === "string" && age.trim() === "") return null;
  const n = typeof age === "number" ? age : Number(age);
  if (!Number.isFinite(n) || !Number.isInteger(n)) throw new Error("profile.age must be an integer");
  return n;
}

function normalizeSource(source) {
  const s = String(source);
  if (s !== "cli" && s !== "api" && s !== "file") {
    throw new Error("meta.source must be one of: cli, api, file");
  }
  return s;
}

function normalize(input) {
  assertObject(input, "input");
  assertObject(input.profile, "profile");
  assertObject(input.meta, "meta");

  const name = String(input.profile.name ?? "").trim();
  if (name.length === 0) throw new Error("profile.name is required");

  const receivedAt = String(input.meta.receivedAt ?? "");
  if (receivedAt.length === 0) throw new Error("meta.receivedAt is required");

  return {
    userId: normalizeUserId(input.userId),
    tags: normalizeTags(input.tags),
    profile: { name, age: normalizeAge(input.profile.age) },
    meta: { receivedAt, source: normalizeSource(input.meta.source) },
  };
}

async function main() {
  const raw = (await readStdin()).trim();
  if (raw.length === 0) return fail("missing input");

  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return fail("invalid JSON");
  }

  const before = JSON.stringify(input);

  let out;
  try {
    out = normalize(input);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "invalid input");
  }

  if (JSON.stringify(input) !== before) return fail("input was mutated");
  process.stdout.write(`${JSON.stringify(out)}\n`);
}

main();

