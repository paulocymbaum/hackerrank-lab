/** Rules for short, exercise-focused review comments shown in the Delivery tab. */

export const MAX_REVIEW_COMMENT_LENGTH = 480;
export const MAX_REVIEW_COMMENT_LINES = 5;

/** Phrases that must not appear in student-facing comments. */
export const BANNED_COMMENT_PATTERNS = [
  /\bdelivery tab\b/i,
  /\bproject-delivery\.json\b/i,
  /\bscore\.json\b/i,
  /\bstudy app\b/i,
  /\breview-course-project\b/i,
  /\bteacher-socratic\b/i,
  /\bcursor skill\b/i,
  /\bcatalog\.json\b/i,
  /\brepo architecture\b/i,
  /\bsubmit(ted|ting)? deliveries?\b/i,
  /\bdelivery workflow\b/i,
  /\*\*module focus:\*\*/i,
  /\*\*gaps vs acceptance criteria:\*\*/i,
  /\*\*next step:\*\*/i,
];

export const COMMENT_TEMPLATE = `[One sentence: what works or main gap vs README.] [One sentence: key missing criterion or bug.] Next: [single concrete fix].`;

export const COMMENT_EXAMPLES = {
  pass:
    "Empty strings rejected with clear errors; age/score use Number() and Number.isFinite. isActive accepts any casing. Solid match to acceptance criteria.",
  failNoCode:
    "No starter/index.js to evaluate. Next: read three stdin lines, reject empty input explicitly, parse numbers with Number.isFinite, normalize isActive, print JSON or ERROR.",
  failPartial:
    "Reads stdin but treats age=0 as missing (truthiness bug). Next: check line.length === 0 and use Number.isFinite instead of if (age).",
};

/**
 * @param {string} comment
 * @returns {{ ok: boolean, errors: string[], warnings: string[] }}
 */
export function validateReviewComment(comment) {
  const errors = [];
  const warnings = [];
  const text = comment.trim();

  if (!text) {
    errors.push("Comment is empty.");
    return { ok: false, errors, warnings };
  }

  if (text.length > MAX_REVIEW_COMMENT_LENGTH) {
    errors.push(
      `Comment is ${text.length} chars; max ${MAX_REVIEW_COMMENT_LENGTH}. Shorten to 2–4 sentences.`,
    );
  }

  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length > MAX_REVIEW_COMMENT_LINES) {
    errors.push(`Comment has ${lines.length} non-empty lines; max ${MAX_REVIEW_COMMENT_LINES}.`);
  }

  if (/^#{1,6}\s/m.test(text) || /\*\*[^*]+\*\*/.test(text)) {
    warnings.push("Prefer plain sentences over markdown headings or bold labels.");
  }

  if (text.split(/\.\s+/).filter(Boolean).length > 5) {
    warnings.push("Prefer at most 4 short sentences.");
  }

  for (const pattern of BANNED_COMMENT_PATTERNS) {
    if (pattern.test(text)) {
      errors.push(`Comment mentions out-of-scope topic (matched: ${pattern}).`);
      break;
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}
