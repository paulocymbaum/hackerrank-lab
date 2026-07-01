import type { ProjectRunRepository } from "../../domain/repositories/projectRunRepository";

let repository: ProjectRunRepository | null = null;

export function setProjectRunRepository(next: ProjectRunRepository): void {
  repository = next;
}

export function getProjectRunRepository(): ProjectRunRepository | null {
  return repository;
}
