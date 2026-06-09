export const PROJECT_DELIVERY_FILE_VERSION = 2;
export const PROJECT_DELIVERY_FILE_VERSION_LEGACY = 1;
export const PROJECT_DELIVERY_FILENAME = "project-delivery.json";
export const PROJECT_DELIVERY_PASS_SCORE = 80;

export function emptyProjectDeliveryFile({ courseId, projectId }) {
  return {
    version: PROJECT_DELIVERY_FILE_VERSION,
    courseId,
    projectId,
    updatedAt: new Date().toISOString(),
    deliveries: [],
  };
}

function isValidReview(review) {
  if (!review || typeof review !== "object") return false;
  if (typeof review.score !== "number" || !Number.isFinite(review.score)) return false;
  if (review.score < 0 || review.score > 100) return false;
  if (typeof review.comment !== "string" || !review.comment.trim()) return false;
  return typeof review.reviewedAt === "string";
}

function isValidProjectDeliveryEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  if (typeof entry.id !== "string") return false;
  if (typeof entry.content !== "string") return false;
  if (typeof entry.submittedAt !== "string") return false;
  if (entry.review !== undefined && !isValidReview(entry.review)) return false;
  return true;
}

export function normalizeProjectDeliveryFile(value, courseId, projectId) {
  if (!value || typeof value !== "object") return null;

  const version = value.version;
  if (version !== PROJECT_DELIVERY_FILE_VERSION && version !== PROJECT_DELIVERY_FILE_VERSION_LEGACY) {
    return null;
  }
  if (typeof value.courseId !== "string") return null;
  if (typeof value.projectId !== "string") return null;
  if (projectId && value.projectId !== projectId) return null;
  const resolvedCourseId = courseId && value.courseId !== courseId ? courseId : value.courseId;
  if (!Array.isArray(value.deliveries)) return null;
  if (!value.deliveries.every(isValidProjectDeliveryEntry)) return null;

  return {
    version: PROJECT_DELIVERY_FILE_VERSION,
    courseId: resolvedCourseId,
    projectId: value.projectId,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date().toISOString(),
    deliveries: value.deliveries,
  };
}

export function appendProjectDelivery(file, content) {
  const submittedAt = new Date().toISOString();
  const entry = {
    id: submittedAt,
    content: content.trim(),
    submittedAt,
  };

  return {
    ...file,
    version: PROJECT_DELIVERY_FILE_VERSION,
    updatedAt: submittedAt,
    deliveries: [...file.deliveries, entry],
  };
}

export function setDeliveryReview(file, deliveryId, reviewInput) {
  const index = file.deliveries.findIndex((entry) => entry.id === deliveryId);
  if (index < 0) return null;

  const review = {
    score: Math.round(reviewInput.score),
    comment: reviewInput.comment.trim(),
    reviewedAt: reviewInput.reviewedAt ?? new Date().toISOString(),
  };

  if (!isValidReview(review)) return null;

  const deliveries = file.deliveries.map((entry, i) =>
    i === index ? { ...entry, review } : entry,
  );

  return {
    ...file,
    version: PROJECT_DELIVERY_FILE_VERSION,
    updatedAt: review.reviewedAt,
    deliveries,
  };
}

export function getLastDeliveries(file, count = 3) {
  return file.deliveries.slice(-count);
}

export function passesReview(score) {
  return score > PROJECT_DELIVERY_PASS_SCORE;
}
