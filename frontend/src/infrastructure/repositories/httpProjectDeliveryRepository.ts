import type { ProjectDeliveryRepository } from "../../domain/repositories/projectDeliveryRepository";
import type { ProjectDeliveryEntry } from "../../domain/types/projectDelivery";
import { normalizeProjectDeliveryFile } from "../../domain/types/projectDelivery";

const API_PREFIX = "/api/project-deliveries";

export const httpProjectDeliveryRepository: ProjectDeliveryRepository = {
  async load(courseId, projectId, rootPath) {
    try {
      const params = new URLSearchParams({
        courseId,
        projectId,
        rootPath,
      });
      const res = await fetch(`${API_PREFIX}?${params.toString()}`);
      if (res.status === 404) return null;
      if (!res.ok) return null;
      const data: unknown = await res.json();
      return normalizeProjectDeliveryFile(data, courseId, projectId);
    } catch {
      return null;
    }
  },

  async appendDelivery(courseId, projectId, rootPath, content) {
    const res = await fetch(API_PREFIX, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        projectId,
        rootPath,
        content,
      } satisfies AppendDeliveryBody),
    });
    if (!res.ok) {
      throw new Error(`Failed to persist project delivery (${res.status})`);
    }
    const data: unknown = await res.json();
    const normalized = normalizeProjectDeliveryFile(data, courseId, projectId);
    if (!normalized) {
      throw new Error("Invalid project delivery response");
    }
    return normalized;
  },

  async saveReview(courseId, projectId, rootPath, deliveryId, review) {
    const res = await fetch(API_PREFIX, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "review",
        courseId,
        projectId,
        rootPath,
        deliveryId,
        score: review.score,
        comment: review.comment,
      } satisfies SaveReviewBody),
    });
    if (!res.ok) {
      throw new Error(`Failed to persist project review (${res.status})`);
    }
    const data: unknown = await res.json();
    const normalized = normalizeProjectDeliveryFile(data, courseId, projectId);
    if (!normalized) {
      throw new Error("Invalid project delivery response");
    }
    return normalized;
  },
};

type AppendDeliveryBody = {
  courseId: string;
  projectId: string;
  rootPath: string;
  content: string;
};

type SaveReviewBody = {
  kind: "review";
  courseId: string;
  projectId: string;
  rootPath: string;
  deliveryId: string;
  score: number;
  comment: string;
};
