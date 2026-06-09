import type { ProjectDeliveryFile } from "../types/projectDelivery";
import { passesDeliveryReview } from "../types/projectDelivery";

export type ProjectDeliveryRepository = {
  load(
    courseId: string,
    projectId: string,
    rootPath: string,
  ): Promise<ProjectDeliveryFile | null>;
  appendDelivery(
    courseId: string,
    projectId: string,
    rootPath: string,
    content: string,
  ): Promise<ProjectDeliveryFile>;
  saveReview(
    courseId: string,
    projectId: string,
    rootPath: string,
    deliveryId: string,
    review: { score: number; comment: string },
  ): Promise<ProjectDeliveryFile>;
};

export { passesDeliveryReview as passesProjectDeliveryReview };
