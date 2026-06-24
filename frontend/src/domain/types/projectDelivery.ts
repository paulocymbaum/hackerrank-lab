import { projectProgressKey } from "./quizScore";

export const PROJECT_DELIVERY_FILE_VERSION = 2 as const;
export const PROJECT_DELIVERY_FILE_VERSION_LEGACY = 1 as const;
export const PROJECT_DELIVERY_FILENAME = "project-delivery.json";
export const PROJECT_DELIVERY_PASS_SCORE = 80;

export type ProjectDeliveryReview = {
  score: number;
  comment: string;
  reviewedAt: string;
};

export type ProjectDeliveryEntry = {
  id: string;
  content: string;
  submittedAt: string;
  review?: ProjectDeliveryReview;
};

export type ProjectDeliveryFile = {
  version: typeof PROJECT_DELIVERY_FILE_VERSION | typeof PROJECT_DELIVERY_FILE_VERSION_LEGACY;
  courseId: string;
  projectId: string;
  updatedAt: string;
  deliveries: ProjectDeliveryEntry[];
};

export function projectDeliveryRelativePath(rootPath: string): string {
  return `${rootPath}/${PROJECT_DELIVERY_FILENAME}`;
}

export function emptyProjectDeliveryFile(input: {
  courseId: string;
  projectId: string;
}): ProjectDeliveryFile {
  return {
    version: PROJECT_DELIVERY_FILE_VERSION,
    courseId: input.courseId,
    projectId: input.projectId,
    updatedAt: new Date().toISOString(),
    deliveries: [],
  };
}

function isValidReview(review: unknown): review is ProjectDeliveryReview {
  if (!review || typeof review !== "object") return false;
  const value = review as ProjectDeliveryReview;
  if (typeof value.score !== "number" || !Number.isFinite(value.score)) return false;
  if (value.score < 0 || value.score > 100) return false;
  if (typeof value.comment !== "string" || !value.comment.trim()) return false;
  return typeof value.reviewedAt === "string";
}

function isValidProjectDeliveryEntry(entry: unknown): entry is ProjectDeliveryEntry {
  if (!entry || typeof entry !== "object") return false;
  const value = entry as ProjectDeliveryEntry;
  if (typeof value.id !== "string") return false;
  if (typeof value.content !== "string") return false;
  if (typeof value.submittedAt !== "string") return false;
  if (value.review !== undefined && !isValidReview(value.review)) return false;
  return true;
}

export function normalizeProjectDeliveryFile(
  value: unknown,
  courseId?: string,
  projectId?: string,
): ProjectDeliveryFile | null {
  if (!value || typeof value !== "object") return null;
  const file = value as ProjectDeliveryFile;
  const version = file.version;
  if (version !== PROJECT_DELIVERY_FILE_VERSION && version !== PROJECT_DELIVERY_FILE_VERSION_LEGACY) {
    return null;
  }
  if (typeof file.courseId !== "string") return null;
  if (typeof file.projectId !== "string") return null;
  if (courseId && file.courseId !== courseId) return null;
  if (projectId && file.projectId !== projectId) return null;
  if (!Array.isArray(file.deliveries)) return null;
  if (!file.deliveries.every(isValidProjectDeliveryEntry)) return null;

  return {
    version: PROJECT_DELIVERY_FILE_VERSION,
    courseId: file.courseId,
    projectId: file.projectId,
    updatedAt: typeof file.updatedAt === "string" ? file.updatedAt : new Date().toISOString(),
    deliveries: file.deliveries,
  };
}

export function appendProjectDelivery(
  file: ProjectDeliveryFile,
  content: string,
): ProjectDeliveryFile {
  const submittedAt = new Date().toISOString();
  const entry: ProjectDeliveryEntry = {
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

export function setDeliveryReview(
  file: ProjectDeliveryFile,
  deliveryId: string,
  reviewInput: { score: number; comment: string; reviewedAt?: string },
): ProjectDeliveryFile | null {
  const index = file.deliveries.findIndex((entry) => entry.id === deliveryId);
  if (index < 0) return null;

  const review: ProjectDeliveryReview = {
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

export function passesDeliveryReview(score: number): boolean {
  return score > PROJECT_DELIVERY_PASS_SCORE;
}

export function mergeDeliveryFileIntoStore(
  courseId: string,
  projectId: string,
  file: ProjectDeliveryFile,
  byKey: Record<string, ProjectDeliveryEntry[]>,
  lessonId?: string,
): Record<string, ProjectDeliveryEntry[]> {
  const key = projectProgressKey(courseId, projectId, lessonId);
  const prev = byKey[key] ?? [];
  const merged = mergeDeliveryEntries(prev, file.deliveries);

  return {
    ...byKey,
    [key]: merged,
  };
}

function mergeDeliveryEntries(
  prev: ProjectDeliveryEntry[],
  next: ProjectDeliveryEntry[],
): ProjectDeliveryEntry[] {
  if (next.length > prev.length) return next;
  if (next.length < prev.length) return prev;

  const countReviews = (entries: ProjectDeliveryEntry[]) =>
    entries.filter((entry) => entry.review).length;

  const nextReviews = countReviews(next);
  const prevReviews = countReviews(prev);
  if (nextReviews > prevReviews) return next;
  if (prevReviews > nextReviews) return prev;
  return next;
}
