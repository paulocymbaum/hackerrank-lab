import { describe, expect, it } from "vitest";
import type { Course } from "../../../domain/types/catalog";
import { contarAtividadesPendentes } from "./mascotePending";

const cursoBase: Course = {
  id: "javascript",
  title: "JavaScript",
  readmePath: "course/readme.md",
  readmeMarkdown: "# JavaScript",
  lessons: [],
  projects: [],
  quizzes: [],
  structure: "hierarchy",
  modules: [
    {
      id: "mod-1",
      title: "Módulo 1",
      readmePath: "course/readme.md",
      readmeMarkdown: "# Módulo",
      lessons: [],
      projects: [],
      quizzes: [
        {
          id: "quiz-1",
          title: "Quiz 1",
          path: "course/quiz-1.json",
          questions: [{ id: "q1", prompt: "?", options: [], correctOptionId: "a" }],
          lessonId: "lesson-1",
        },
      ],
    },
  ],
};

describe("contarAtividadesPendentes", () => {
  it("conta quiz sem progresso como pendente", () => {
    const total = contarAtividadesPendentes({
      cursos: [cursoBase],
      progressoQuizPorChave: {},
      progressoProjetoPorChave: {},
    });
    expect(total).toBe(1);
  });

  it("não conta quiz concluído com 70% ou mais", () => {
    const total = contarAtividadesPendentes({
      cursos: [cursoBase],
      progressoQuizPorChave: {
        "javascript:quiz:lesson-1:quiz-1": { bestScore: 1, bestTotal: 1 },
      },
      progressoProjetoPorChave: {},
    });
    expect(total).toBe(0);
  });
});
