import { httpProjectDeliveryRepository } from "../repositories/httpProjectDeliveryRepository";
import { setProjectDeliveryRepository } from "../../application/usecases/projectDeliveries";

export function bootstrapProjectDeliveryPersistence(): void {
  setProjectDeliveryRepository(httpProjectDeliveryRepository);
}
