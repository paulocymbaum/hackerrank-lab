import type { ProjectDeliveryRepository } from "../../domain/repositories/projectDeliveryRepository";
import type { ProjectDeliveryEntry } from "../../domain/types/projectDelivery";
import { passesDeliveryReview } from "../../domain/types/projectDelivery";
import { useProjectDeliveryStore } from "../stores/projectDeliveryStore";
import { useProjectProgressStore } from "../stores/projectProgressStore";

let repository: ProjectDeliveryRepository | null = null;

export function setProjectDeliveryRepository(next: ProjectDeliveryRepository): void {
  repository = next;
}

function syncProjectStatusFromDeliveries(
  courseId: string,
  projectId: string,
  deliveries: ProjectDeliveryEntry[],
  lessonId?: string,
): void {
  const latest = deliveries[deliveries.length - 1];
  if (latest?.review && passesDeliveryReview(latest.review.score)) {
    useProjectProgressStore.getState().markProjectDone(courseId, projectId, lessonId);
  }
}

export async function loadProjectDeliveries(
  courseId: string,
  projectId: string,
  rootPath: string,
  lessonId?: string,
): Promise<void> {
  if (!repository) return;

  useProjectDeliveryStore.getState().setLoading(courseId, projectId, true, lessonId);
  useProjectDeliveryStore.getState().setError(courseId, projectId, null, lessonId);

  try {
    const file = await repository.load(courseId, projectId, rootPath);
    if (file) {
      useProjectDeliveryStore.getState().hydrate(courseId, projectId, file.deliveries, lessonId);
      syncProjectStatusFromDeliveries(courseId, projectId, file.deliveries, lessonId);
    }
  } catch {
    useProjectDeliveryStore.getState().setError(
      courseId,
      projectId,
      "Failed to load deliveries",
      lessonId,
    );
  } finally {
    useProjectDeliveryStore.getState().setLoading(courseId, projectId, false, lessonId);
  }
}

export async function persistProjectDelivery(
  courseId: string,
  projectId: string,
  rootPath: string,
  content: string,
): Promise<boolean> {
  if (!repository) return false;

  try {
    const file = await repository.appendDelivery(courseId, projectId, rootPath, content);
    const lessonId = rootPath.includes("/lessons/")
      ? rootPath.split("/lessons/")[1]?.split("/")[0]
      : undefined;
    useProjectDeliveryStore.getState().hydrate(courseId, projectId, file.deliveries, lessonId);
    return true;
  } catch {
    return false;
  }
}
