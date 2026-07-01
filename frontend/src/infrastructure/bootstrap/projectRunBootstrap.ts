import { httpProjectRunRepository } from "../repositories/httpProjectRunRepository";
import { setProjectRunRepository } from "../../application/usecases/projectRun";

export function bootstrapProjectRun(): void {
  setProjectRunRepository(httpProjectRunRepository);
}
