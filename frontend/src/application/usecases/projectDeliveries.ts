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
): void {
  const latest = deliveries[deliveries.length - 1];
  if (latest?.review && passesDeliveryReview(latest.review.score)) {
    useProjectProgressStore.getState().markProjectDone(courseId, projectId);
  }
}

export async function loadProjectDeliveries(
  courseId: string,
  projectId: string,
  rootPath: string,
): Promise<void> {
  if (!repository) return;

  useProjectDeliveryStore.getState().setLoading(courseId, projectId, true);
  useProjectDeliveryStore.getState().setError(courseId, projectId, null);

  try {
    const file = await repository.load(courseId, projectId, rootPath);
    if (file) {
      useProjectDeliveryStore.getState().hydrate(courseId, projectId, file.deliveries);
      syncProjectStatusFromDeliveries(courseId, projectId, file.deliveries);
    }
  } catch {
    useProjectDeliveryStore.getState().setError(courseId, projectId, "Failed to load deliveries");
  } finally {
    useProjectDeliveryStore.getState().setLoading(courseId, projectId, false);
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
    useProjectDeliveryStore.getState().hydrate(courseId, projectId, file.deliveries);
    return true;
  } catch {
    return false;
  }
}
