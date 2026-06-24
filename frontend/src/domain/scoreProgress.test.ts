import { describe, expect, it } from "vitest";
import { submissionScoreTier } from "./scoreProgress";

describe("submissionScoreTier", () => {
  it("uses success above 80%", () => {
    expect(submissionScoreTier(81)).toBe("success");
    expect(submissionScoreTier(100)).toBe("success");
  });

  it("uses warning between 50% and 80% inclusive", () => {
    expect(submissionScoreTier(80)).toBe("warning");
    expect(submissionScoreTier(50)).toBe("warning");
    expect(submissionScoreTier(65)).toBe("warning");
  });

  it("uses danger below 50%", () => {
    expect(submissionScoreTier(49)).toBe("danger");
    expect(submissionScoreTier(0)).toBe("danger");
  });
});
