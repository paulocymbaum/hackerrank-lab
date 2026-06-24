import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeProjectDeliveryFile } from "../../frontend/scripts/project-delivery-lib.mjs";

describe("project delivery normalize", () => {
  it("rewrites courseId mismatch to request courseId", () => {
    const file = normalizeProjectDeliveryFile(
      {
        version: 2,
        courseId: "01-javascript-fundamentals",
        projectId: "001-cli-input-validator",
        deliveries: [],
      },
      "javascript",
      "001-cli-input-validator",
    );

    assert.ok(file);
    assert.equal(file.courseId, "javascript");
  });

  it("returns null for projectId mismatch", () => {
    const file = normalizeProjectDeliveryFile(
      {
        version: 2,
        courseId: "javascript",
        projectId: "001-cli-input-validator",
        deliveries: [],
      },
      "javascript",
      "other-project",
    );

    assert.equal(file, null);
  });
});
