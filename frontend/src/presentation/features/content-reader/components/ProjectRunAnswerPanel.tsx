import type {
  ProjectRunErrorCode,
  ProjectTestCaseResult,
  ProjectTestMatrixResult,
} from "../../../../domain/types/projectRun";
import type { ProjectTestCase } from "../../../../application/usecases/projectTestCases";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Accordion, Button } from "../../../design-system";

function runErrorMessage(
  t: ReturnType<typeof useTranslation>["t"],
  error: ProjectRunErrorCode | "dev_server",
): string {
  if (error === "dev_server") return t("delivery.runSampleDevServerRequired");
  if (error === "missing_tests") return t("delivery.missingTestFile");
  if (error === "missing_starter") return t("delivery.runSampleUnavailable");
  return t("delivery.runSampleDevServerRequired");
}

function statusLabel(
  t: ReturnType<typeof useTranslation>["t"],
  status: ProjectTestCaseResult["status"],
): string {
  if (status === "passed") return t("delivery.testStatusPassed");
  if (status === "failed") return t("delivery.testStatusFailed");
  return t("delivery.testStatusRan");
}

function statusClass(status: ProjectTestCaseResult["status"]): string {
  if (status === "passed") return "border-successBorder bg-successFill text-successText";
  if (status === "failed") return "border-dangerBorder bg-dangerFill text-dangerText";
  return "border-border0 bg-surfaceControl text-text1";
}

function failureMessage(
  t: ReturnType<typeof useTranslation>["t"],
  testCase: ProjectTestCaseResult,
): string | null {
  if (!testCase.failureReason) return null;
  if (testCase.failureReason === "stdout_mismatch") return t("delivery.testFailureStdout");
  if (testCase.failureReason === "exit_code") return t("delivery.testFailureExitCode");
  if (testCase.failureReason === "timeout") return t("delivery.testFailureTimeout");
  return t("delivery.testFailureError");
}

function TestCaseDetails(props: {
  testCase: ProjectTestCaseResult;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const { testCase, t } = props;
  const failure = failureMessage(t, testCase);

  return (
    <div className="grid gap-3 border-t border-border0 px-3 py-3 text-meta">
      <div>
        <p className="m-0 mb-1 font-medium text-text0">{t("delivery.testStdin")}</p>
        <pre className="m-0 overflow-auto whitespace-pre-wrap break-words rounded-panel border border-border0 bg-surfaceControl p-2 font-mono text-text0">
          {testCase.stdin || t("delivery.testStdinEmpty")}
        </pre>
      </div>

      <div>
        <p className="m-0 mb-1 font-medium text-text0">{t("delivery.testStdout")}</p>
        <pre className="m-0 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-panel border border-border0 bg-surfaceControl p-2 font-mono text-text0">
          {[testCase.stdout, testCase.stderr].filter(Boolean).join("") || t("delivery.runSampleNoOutput")}
        </pre>
      </div>

      {typeof testCase.expectedStdout === "string" ? (
        <div>
          <p className="m-0 mb-1 font-medium text-text0">{t("delivery.testExpectedStdout")}</p>
          <pre className="m-0 overflow-auto whitespace-pre-wrap break-words rounded-panel border border-border0 bg-surfaceControl p-2 font-mono text-text0">
            {testCase.expectedStdout}
          </pre>
        </div>
      ) : null}

      <p className="m-0 text-text1">
        {t("delivery.runSampleExitCode", { code: String(testCase.exitCode) })}
        {testCase.timedOut ? ` · ${t("delivery.runSampleTimedOut")}` : null}
      </p>

      {failure ? <p className="m-0 text-text1">{failure}</p> : null}
    </div>
  );
}

function TestMatrixSummary(props: {
  matrix: ProjectTestMatrixResult;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const { matrix, t } = props;
  const scoredCount = matrix.passedCount + matrix.failedCount;

  return (
    <div className="flex flex-wrap items-center gap-2 text-meta text-text1">
      <span className="font-medium text-text0">
        {t("delivery.testMatrixSummary", {
          passed: String(matrix.passedCount),
          failed: String(matrix.failedCount),
          total: String(matrix.totalCount),
        })}
      </span>
      {scoredCount === 0 ? (
        <span>{t("delivery.testMatrixNoExpectations")}</span>
      ) : matrix.failedCount === 0 ? (
        <span className="text-successText">{t("delivery.testMatrixAllPassed")}</span>
      ) : null}
    </div>
  );
}

function ConfiguredTestCases(props: {
  testCases: ProjectTestCase[];
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const { testCases, t } = props;

  return (
    <div className="rounded-panel border border-border0 bg-surfaceControl px-3 py-2">
      <p className="m-0 mb-2 text-meta font-medium text-text0">{t("delivery.testCasesConfigured")}</p>
      <ul className="m-0 list-none space-y-1 p-0">
        {testCases.map((testCase) => (
          <li key={testCase.id} className="truncate text-meta text-text1">
            {testCase.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectRunAnswerPanel(props: {
  canRun: boolean;
  running: boolean;
  matrix: ProjectTestMatrixResult | null;
  testCases: ProjectTestCase[] | null;
  error: ProjectRunErrorCode | "dev_server" | null;
  onRun: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 rounded-panel border border-border0 bg-surfacePanel p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-meta text-text1">{t("delivery.runAnswerHint")}</p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!props.canRun || props.running}
          title={props.canRun ? t("delivery.runAnswerTooltip") : t("delivery.runSampleUnavailable")}
          onClick={props.onRun}
        >
          {props.running ? t("delivery.runningSample") : t("delivery.runAnswer")}
        </Button>
      </div>

      {props.error ? (
        <p className="m-0 text-meta text-text1">{runErrorMessage(t, props.error)}</p>
      ) : null}

      {!props.matrix && props.testCases?.length ? (
        <ConfiguredTestCases testCases={props.testCases} t={t} />
      ) : null}

      {props.matrix ? (
        <div className="overflow-hidden rounded-panel border border-border0 bg-surfaceControl">
          <div className="border-b border-border0 px-3 py-2">
            <TestMatrixSummary matrix={props.matrix} t={t} />
          </div>

          <div className="hidden grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-border0 px-3 py-2 text-meta font-medium text-text1 md:grid">
            <span>{t("delivery.testMatrixCase")}</span>
            <span>{t("delivery.testMatrixStatus")}</span>
          </div>

          <div className="flex flex-col gap-2 p-2">
            {props.matrix.cases.map((testCase) => (
              <Accordion
                key={testCase.id}
                title={
                  <div className="grid w-full min-w-0 grid-cols-1 items-center gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-body font-medium text-text0">{testCase.name}</p>
                      <p className="truncate font-mono text-meta text-text1">{testCase.command}</p>
                    </div>
                    <span
                      className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-meta font-medium ${statusClass(testCase.status)}`}
                    >
                      {statusLabel(t, testCase.status)}
                    </span>
                  </div>
                }
              >
                <TestCaseDetails testCase={testCase} t={t} />
              </Accordion>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
