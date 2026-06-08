import { httpCourseScoreRepository } from "../repositories/httpQuizScoreRepository";
import { setCourseScoreRepository } from "../../application/usecases/courseScores";

export function bootstrapQuizScorePersistence(): void {
  setCourseScoreRepository(httpCourseScoreRepository);
}
