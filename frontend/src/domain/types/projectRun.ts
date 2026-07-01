export type ProjectTestCaseStatus = "passed" | "failed" | "ran";

export type ProjectTestCaseFailureReason = "stdout_mismatch" | "exit_code" | "timeout" | "error";

export type ProjectTestCaseResult = {
  id: string;
  name: string;
  status: ProjectTestCaseStatus;
  command: string;
  stdin: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut: boolean;
  expectedStdout?: string;
  expectedExitCode?: number;
  failureReason?: ProjectTestCaseFailureReason;
};

export type ProjectTestMatrixResult = {
  passedCount: number;
  failedCount: number;
  totalCount: number;
  cases: ProjectTestCaseResult[];
};

export type ProjectRunErrorCode = "missing_tests" | "missing_starter" | "unavailable";

export type ProjectRunOutcome =
  | { status: "ok"; matrix: ProjectTestMatrixResult }
  | { status: "error"; code: ProjectRunErrorCode };

/** @deprecated Single-run result kept for transitional typing. */
export type ProjectRunResult = {
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut: boolean;
};
