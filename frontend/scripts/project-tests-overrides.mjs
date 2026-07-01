/**
 * Curated starter/tests.json cases keyed by project folder slug.
 * Overrides README-derived drafts when present.
 */
export const PROJECT_TEST_OVERRIDES = {
  "004-hello-stdin": {
    cases: [
      {
        id: "example",
        name: "Example greeting",
        stdin: "Maria\n",
        expectedStdout: "Hello, Maria!\n",
        expectedExitCode: 0,
      },
      {
        id: "alice",
        name: "Input Alice",
        stdin: "Alice\n",
        expectedStdout: "Hello, Alice!\n",
        expectedExitCode: 0,
      },
      {
        id: "trim-bob",
        name: "Trimmed Bob",
        stdin: "  Bob  \n",
        expectedStdout: "Hello, Bob!\n",
        expectedExitCode: 0,
      },
      {
        id: "empty-line",
        name: "Empty line error",
        stdin: "\n",
        expectedStdout: "ERROR: name is required\n",
        expectedExitCode: 0,
      },
    ],
  },
  "005-receipt-printer": {
    cases: [
      {
        id: "example",
        name: "Notebook receipt",
        stdin: "Notebook\n3\n4.25\n",
        expectedStdout: "Item: Notebook\nQty: 3\nUnit: $4.25\nTotal: $12.75\n",
        expectedExitCode: 0,
      },
      {
        id: "coffee",
        name: "Coffee total $7.00",
        stdin: "Coffee\n2\n3.5\n",
        expectedStdout: "Item: Coffee\nQty: 2\nUnit: $3.50\nTotal: $7.00\n",
        expectedExitCode: 0,
      },
      {
        id: "empty-item",
        name: "Empty item error",
        stdin: "\n2\n3.5\n",
        expectedStdout: "ERROR: item is required\n",
        expectedExitCode: 0,
      },
      {
        id: "bad-quantity",
        name: "Invalid quantity",
        stdin: "Pen\nabc\n1.00\n",
        expectedStdout: "ERROR: quantity must be a positive integer\n",
        expectedExitCode: 0,
      },
    ],
  },
  "006-leaderboard-scores": {
    cases: [
      {
        id: "main-demo",
        name: "Main demo output",
        stdin: "",
        expectedStdout: '{"alice":12,"bob":4,"carol":8}\n',
        expectedExitCode: 0,
      },
    ],
  },
  "007-user-badge-formatter": {
    cases: [
      {
        id: "main-demo",
        name: "Main demo badge",
        stdin: "",
        expectedStdout: "[L3] Ana Silva (@anas)\n",
        expectedExitCode: 0,
      },
    ],
  },
  "008-bill-split-calculator": {
    cases: [
      {
        id: "example",
        name: "Numeric add",
        stdin: "10\n+\n5\n",
        expectedStdout: "Result: 15\n",
        expectedExitCode: 0,
      },
      {
        id: "string-concat",
        name: "String concat add",
        stdin: '"10"\n+\n5\n',
        expectedStdout: "Result: 105\n",
        expectedExitCode: 0,
      },
      {
        id: "modulo",
        name: "Modulo",
        stdin: "10\n%\n3\n",
        expectedStdout: "Result: 1\n",
        expectedExitCode: 0,
      },
      {
        id: "power",
        name: "Exponent",
        stdin: "2\n**\n3\n",
        expectedStdout: "Result: 8\n",
        expectedExitCode: 0,
      },
    ],
  },
  "009-grade-classifier": {
    cases: [
      {
        id: "example",
        name: "Grade B example",
        stdin: "84\n",
        expectedStdout: "Grade: B\n",
        expectedExitCode: 0,
      },
      {
        id: "grade-a",
        name: "Grade A",
        stdin: "90\n",
        expectedStdout: "Grade: A\n",
        expectedExitCode: 0,
      },
      {
        id: "grade-f",
        name: "Grade F",
        stdin: "59\n",
        expectedStdout: "Grade: F\n",
        expectedExitCode: 0,
      },
      {
        id: "invalid",
        name: "Invalid score",
        stdin: "abc\n",
        expectedStdout: "ERROR: invalid score\n",
        expectedExitCode: 0,
      },
    ],
  },
  "010-sum-range": {
    cases: [
      {
        id: "example",
        name: "Sum 1 to 4",
        stdin: "1\n4\n",
        expectedStdout: "Sum: 10\n",
        expectedExitCode: 0,
      },
      {
        id: "one-to-five",
        name: "Sum 1 to 5",
        stdin: "1\n5\n",
        expectedStdout: "Sum: 15\n",
        expectedExitCode: 0,
      },
      {
        id: "reversed-range",
        name: "Reversed range",
        stdin: "5\n1\n",
        expectedStdout: "Sum: 15\n",
        expectedExitCode: 0,
      },
    ],
  },
  "011-celsius-converter": {
    cases: [
      {
        id: "example",
        name: "Freezing point",
        stdin: "0\n",
        expectedStdout: "F: 32.0\n",
        expectedExitCode: 0,
      },
      {
        id: "body-temp",
        name: "Body temperature",
        stdin: "37.5\n",
        expectedStdout: "F: 99.5\n",
        expectedExitCode: 0,
      },
      {
        id: "invalid",
        name: "Invalid input",
        stdin: "abc\n",
        expectedStdout: "ERROR: invalid temperature\n",
        expectedExitCode: 0,
      },
    ],
  },
  "013-validation-doc-block": {
    cases: [
      {
        id: "example",
        name: "Valid name high score",
        stdin: "Ana\n200\n",
        expectedStdout: "OK\n",
        expectedExitCode: 0,
      },
      {
        id: "empty-name",
        name: "Empty name",
        stdin: " \n50\n",
        expectedStdout: "ERROR: name is required\n",
        expectedExitCode: 0,
      },
    ],
  },
  "014-score-accumulator": {
    cases: [
      {
        id: "example",
        name: "Example from README",
        stdin: "10\n+25\n-10\n*2\ndone\n",
        expectedStdout: "Total: 50\n",
        expectedExitCode: 0,
      },
      {
        id: "acceptance-chain",
        name: "Compound operations",
        stdin: "10\n+5\n-3\n*2\ndone\n",
        expectedStdout: "Total: 24\n",
        expectedExitCode: 0,
      },
      {
        id: "only-done",
        name: "Initial score only",
        stdin: "100\ndone\n",
        expectedStdout: "Total: 100\n",
        expectedExitCode: 0,
      },
      {
        id: "invalid-score",
        name: "Invalid initial score",
        stdin: "abc\n",
        expectedStdout: "ERROR: invalid score\n",
        expectedExitCode: 0,
      },
      {
        id: "invalid-operation",
        name: "Invalid operation",
        stdin: "10\n+x\ndone\n",
        expectedStdout: "ERROR: invalid operation\n",
        expectedExitCode: 0,
      },
    ],
  },
  "015-price-split-formatter": {
    cases: [
      {
        id: "example",
        name: "Even split",
        stdin: "100\n4\n",
        expectedStdout: "Share: $25.00\n",
        expectedExitCode: 0,
      },
      {
        id: "rounding",
        name: "Rounded share",
        stdin: "10\n3\n",
        expectedStdout: "Share: $3.33\n",
        expectedExitCode: 0,
      },
      {
        id: "invalid-total",
        name: "Invalid total",
        stdin: "abc\n4\n",
        expectedStdout: "ERROR: invalid number\n",
        expectedExitCode: 0,
      },
    ],
  },
  "016-validation-flags-reporter": {
    cases: [
      {
        id: "example",
        name: "Score 90 flags",
        stdin: "90\n",
        expectedStdout: "passed: true\nperfect: false\ninvalid: false\n",
        expectedExitCode: 0,
      },
      {
        id: "perfect",
        name: "Perfect score",
        stdin: "100\n",
        expectedStdout: "passed: true\nperfect: true\ninvalid: false\n",
        expectedExitCode: 0,
      },
      {
        id: "invalid-score",
        name: "Invalid high score",
        stdin: "105\n",
        expectedStdout: "passed: true\nperfect: false\ninvalid: true\n",
        expectedExitCode: 0,
      },
    ],
  },
  "017-missing-value-labeler": {
    cases: [
      {
        id: "example",
        name: "Null is explicitly empty",
        stdin: "null\ndone\n",
        expectedStdout: "explicitly empty\n",
        expectedExitCode: 0,
      },
      {
        id: "undefined",
        name: "Undefined label",
        stdin: "undefined\ndone\n",
        expectedStdout: "not provided\n",
        expectedExitCode: 0,
      },
      {
        id: "string-value",
        name: "String value",
        stdin: '"Ana"\ndone\n',
        expectedStdout: "has value: Ana\n",
        expectedExitCode: 0,
      },
    ],
  },
  "018-boundary-checker": {
    cases: [
      {
        id: "example",
        name: "In range example",
        stdin: "89\n0\n100\n",
        expectedStdout: "IN RANGE\n",
        expectedExitCode: 0,
      },
      {
        id: "out-of-range",
        name: "Out of range",
        stdin: "90\n0\n89\n",
        expectedStdout: "OUT OF RANGE\n",
        expectedExitCode: 0,
      },
      {
        id: "invalid-range",
        name: "Invalid range",
        stdin: "10\n20\n10\n",
        expectedStdout: "ERROR: invalid range\n",
        expectedExitCode: 0,
      },
    ],
  },
  "019-access-gate-validator": {
    cases: [
      {
        id: "example",
        name: "Allowed adult",
        stdin: "20\ntrue\n",
        expectedStdout: "ALLOWED\n",
        expectedExitCode: 0,
      },
      {
        id: "denied-no-id",
        name: "Denied without ID",
        stdin: "20\nfalse\n",
        expectedStdout: "DENIED\n",
        expectedExitCode: 0,
      },
      {
        id: "denied-underage",
        name: "Denied underage",
        stdin: "17\ntrue\n",
        expectedStdout: "DENIED\n",
        expectedExitCode: 0,
      },
    ],
  },
  "020-menu-command-router": {
    cases: [
      {
        id: "example",
        name: "Quit command",
        stdin: "quit\n",
        expectedStdout: "Goodbye\n",
        expectedExitCode: 0,
      },
      {
        id: "start",
        name: "Start command",
        stdin: "start\n",
        expectedStdout: "Starting\n",
        expectedExitCode: 0,
      },
      {
        id: "unknown-case",
        name: "Case-sensitive unknown",
        stdin: "Start\n",
        expectedStdout: "Unknown command\n",
        expectedExitCode: 0,
      },
    ],
  },
  "021-sentinel-sum": {
    cases: [
      {
        id: "example",
        name: "Sum until zero",
        stdin: "10\n20\n0\n",
        expectedStdout: "Sum: 30\n",
        expectedExitCode: 0,
      },
      {
        id: "immediate-zero",
        name: "Immediate sentinel",
        stdin: "0\n",
        expectedStdout: "Sum: 0\n",
        expectedExitCode: 0,
      },
      {
        id: "negative-values",
        name: "Negative values",
        stdin: "-3\n7\n0\n",
        expectedStdout: "Sum: 4\n",
        expectedExitCode: 0,
      },
    ],
  },
  "022-clamp-utility": {
    cases: [
      {
        id: "example",
        name: "Clamp below min",
        stdin: "-3\n0\n10\n",
        expectedStdout: "Result: 0\n",
        expectedExitCode: 0,
      },
      {
        id: "in-range",
        name: "Value in range",
        stdin: "5\n0\n10\n",
        expectedStdout: "Result: 5\n",
        expectedExitCode: 0,
      },
      {
        id: "invalid-range",
        name: "Invalid range",
        stdin: "5\n10\n0\n",
        expectedStdout: "ERROR: invalid range\n",
        expectedExitCode: 0,
      },
    ],
  },
  "023-default-config-builder": {
    cases: [
      {
        id: "all-defaults",
        name: "All defaults",
        stdin: "\n\n\n\n",
        expectedStdout: "retries: 3\ntimeout: 5000\nlabel: default\nactive: false\n",
        expectedExitCode: 0,
      },
      {
        id: "custom-values",
        name: "Custom label trim",
        stdin: "5\nnull\n  api  \nfalse\n",
        expectedStdout: "retries: 5\ntimeout: 5000\nlabel: api\nactive: false\n",
        expectedExitCode: 0,
      },
    ],
  },
  "001-cli-input-validator": {
    cases: [
      {
        id: "zero",
        name: "0 is falsy with naive gate pitfall",
        stdin: "0\ndone\n",
        expectedStdout: "classify: falsy\nnaiveGate: blocked\nnote: 0 is valid but falsy\n",
        expectedExitCode: 0,
      },
      {
        id: "string-zero",
        name: '"0" is truthy',
        stdin: '"0"\ndone\n',
        expectedStdout: "classify: truthy\n",
        expectedExitCode: 0,
      },
      {
        id: "empty-string",
        name: "Empty string is falsy",
        stdin: '""\ndone\n',
        expectedStdout: "classify: falsy\n",
        expectedExitCode: 0,
      },
      {
        id: "space-string",
        name: "Space string is truthy",
        stdin: '" "\ndone\n',
        expectedStdout: "classify: truthy\n",
        expectedExitCode: 0,
      },
      {
        id: "empty-array",
        name: "Empty array is truthy",
        stdin: "[]\ndone\n",
        expectedStdout: "classify: truthy\n",
        expectedExitCode: 0,
      },
    ],
  },
  "002-data-normalizer": {
    cases: [
      {
        id: "example",
        name: "Empty string coerces with ==",
        stdin: '""\n==\n0\n',
        expectedStdout: "result: true\nrule: empty string coerces to 0 with ==\n",
        expectedExitCode: 0,
      },
      {
        id: "strict-null",
        name: "Strict null vs undefined",
        stdin: "null\n===\nundefined\n",
        expectedStdout: "result: false\n",
        expectedExitCode: 0,
      },
      {
        id: "loose-null",
        name: "Loose null vs undefined",
        stdin: "null\n==\nundefined\n",
        expectedStdout: "result: true\n",
        expectedExitCode: 0,
      },
    ],
  },
  "003-record-filter": {
    cases: [
      {
        id: "example",
        name: "Array vs zero",
        stdin: "[]\n0\n",
        expectedStdout: "loose: true\nstrict: false\nprefer: ===\n",
        expectedExitCode: 0,
      },
      {
        id: "same-zero",
        name: "Zero strict match",
        stdin: "0\n0\n",
        expectedStdout: "loose: true\nstrict: true\nprefer: either (same result)\n",
        expectedExitCode: 0,
      },
      {
        id: "null-undefined",
        name: "Null vs undefined",
        stdin: "null\nundefined\n",
        expectedStdout: "loose: true\nstrict: false\nprefer: ===\n",
        expectedExitCode: 0,
      },
    ],
  },
  "001-safe-normalizer": {
    cases: [
      {
        id: "alias-tracker",
        name: "Alias tracker steps",
        stdin: "",
        expectedStdout:
          "step 1: original.n=1 unchanged (binding)\nstep 2: original.n=2 changed (mutation)\nstep 3: original.n=2 unchanged (reassignment)\nstep 4: original.n=5 changed (mutation)\nfinal: original.n=5 b.n=99\n",
        expectedExitCode: 0,
      },
    ],
  },
  "001-nested-state-updater": {
    cases: [
      {
        id: "example",
        name: "Increment item qty",
        stdin: '{"state":{"items":[{"id":1,"qty":1},{"id":2,"qty":5}]},"itemId":1}\n',
        expectedStdout: '{"nextState":{"items":[{"id":1,"qty":2},{"id":2,"qty":5}]}}\n',
        expectedExitCode: 0,
      },
    ],
  },
  "001-snapshot-cloner": {
    cases: [
      {
        id: "example",
        name: "Clone nested object",
        stdin: '{"name":"Ana","meta":{"score":10}}\n',
        expectedStdout: '{"name":"Ana","meta":{"score":10}}\n',
        expectedExitCode: 0,
      },
    ],
  },
  "001-own-keys-filter": {
    cases: [
      {
        id: "example",
        name: "Own keys sorted",
        stdin: '{"name":"Ana","score":10}\n',
        expectedStdout: '["name","score"]\n',
        expectedExitCode: 0,
      },
      {
        id: "empty-object",
        name: "Empty object",
        stdin: "{}\n",
        expectedStdout: "[]\n",
        expectedExitCode: 0,
      },
      {
        id: "sorted-keys",
        name: "Sorted keys",
        stdin: '{"b":1,"a":2}\n',
        expectedStdout: '["a","b"]\n',
        expectedExitCode: 0,
      },
    ],
  },
  "001-sync-trace": {
    cases: [
      {
        id: "example",
        name: "Basic snippet",
        stdin: "basic\n",
        expectedStdout: "Sync order: A C\n",
        expectedExitCode: 0,
      },
      {
        id: "nested",
        name: "Nested snippet",
        stdin: "nested\n",
        expectedStdout: "Sync order: 1 4\n",
        expectedExitCode: 0,
      },
      {
        id: "unknown",
        name: "Unknown snippet",
        stdin: "unknown\n",
        expectedStdout: "ERROR: unknown snippet\n",
        expectedExitCode: 0,
      },
    ],
  },
  "001-output-order-predictor": {
    cases: [
      {
        id: "all-snippets",
        name: "All snippet analyses",
        stdin: "",
        expectedStdout:
          "=== basic ===\norder: A B micro timer\n  A:sync\n  B:sync\n  micro:microtask\n  timer:task\nexplanation: Sync logs run on the call stack first. Promise reactions are microtasks and drain before the setTimeout task runs.\n\n=== async-await ===\norder: A C B\n  A:sync\n  C:sync\n  B:microtask\nexplanation: main() runs until await, which schedules the rest as a microtask. C prints before B resumes.\n\n=== chained-microtasks ===\norder: m1 m2 t1\n  m1:microtask\n  m2:microtask\n  t1:task\nexplanation: Microtasks m1 and m2 drain completely before task t1 from setTimeout.\n\n=== trick ===\norder: start end micro timer\n  start:sync\n  end:sync\n  micro:microtask\n  timer:task\nexplanation: Microtasks always run before the next task, so micro prints before timer even with setTimeout(0).\n\n",
        expectedExitCode: 0,
      },
    ],
  },
  "001-microtask-before-timer": {
    cases: [
      {
        id: "demo-output",
        name: "Microtask before timer demo",
        stdin: "",
        expectedStdout:
          "order: start end micro timer\nrule: microtasks drain before the next task\nmicro_before_timer: true\n",
        expectedExitCode: 0,
      },
    ],
  },
  "002-retry-with-backoff": {
    cases: [
      {
        id: "example",
        name: "Successful read",
        stdin: "users.json\n",
        expectedStdout: "data:users.json -> parsed -> done\n",
        expectedExitCode: 0,
      },
      {
        id: "fail-path",
        name: "Missing file error",
        stdin: "fail\n",
        expectedStdout: "ERROR: not found\n",
        expectedExitCode: 0,
      },
    ],
  },
  "003-concurrency-limiter": {
    cases: [
      {
        id: "example",
        name: "Successful pipeline",
        stdin: "ok\n",
        expectedStdout: "fetch:ok | transform:ok | save:ok\n",
        expectedExitCode: 0,
      },
      {
        id: "fail",
        name: "Save failure",
        stdin: "fail\n",
        expectedStdout: "ERROR: save failed\n",
        expectedExitCode: 0,
      },
    ],
  },
  "001-to-result": {
    cases: [
      {
        id: "example",
        name: "Ok path",
        stdin: "ok\n",
        expectedStdout: "ok:42\n",
        expectedExitCode: 0,
      },
      {
        id: "fail",
        name: "Error path",
        stdin: "fail\n",
        expectedStdout: "err:boom\n",
        expectedExitCode: 0,
      },
    ],
  },
};

export function getProjectTestOverride(projectDirName) {
  return PROJECT_TEST_OVERRIDES[projectDirName] ?? null;
}
