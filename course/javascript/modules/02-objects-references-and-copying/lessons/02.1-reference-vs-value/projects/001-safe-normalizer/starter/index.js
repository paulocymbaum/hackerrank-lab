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
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    throw new Error("profile.age must be an integer");
  }
  return n;
}

function normalizeUserId(userId) {
  const n = typeof userId === "number" ? userId : Number(userId);
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    throw new Error("userId must be an integer");
  }
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
  if (input == null || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("input must be a JSON object");
  }

  const profileIn = input.profile;
  if (profileIn == null || typeof profileIn !== "object" || Array.isArray(profileIn)) {
    throw new Error("profile must be an object");
  }

  const metaIn = input.meta;
  if (metaIn == null || typeof metaIn !== "object" || Array.isArray(metaIn)) {
    throw new Error("meta must be an object");
  }

  const name = String(profileIn.name ?? "").trim();
  if (name.length === 0) throw new Error("profile.name is required");

  const receivedAt = String(metaIn.receivedAt ?? "");
  if (receivedAt.length === 0) throw new Error("meta.receivedAt is required");

  return {
    userId: normalizeUserId(input.userId),
    tags: normalizeTags(input.tags),
    profile: {
      name,
      age: normalizeAge(profileIn.age),
    },
    meta: {
      receivedAt,
      source: normalizeSource(metaIn.source),
    },
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

  let output;
  try {
    output = normalize(input);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "invalid input");
  }

  const after = JSON.stringify(input);
  if (before !== after) return fail("input was mutated");

  process.stdout.write(`${JSON.stringify(output)}\n`);
}

main();

