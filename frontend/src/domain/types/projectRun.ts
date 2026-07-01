export type ProjectRunResult = {
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut: boolean;
};

export type ProjectRunErrorCode = "missing_sample_input" | "missing_starter" | "unavailable";

export type ProjectRunOutcome =
  | { status: "ok"; result: ProjectRunResult }
  | { status: "error"; code: ProjectRunErrorCode };
