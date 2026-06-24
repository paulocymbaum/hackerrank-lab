import type { NavigateFunction } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { criarEstrategiaHierarquia } from "./estrategiaHierarquia";
import type { NavegacaoCursoDeps } from "./tiposNavegacaoCurso";

function criarDepsMock(): NavegacaoCursoDeps & { urls: string[] } {
  const urls: string[] = [];
  const navigate = ((to: string | { pathname?: string }) => {
    urls.push(typeof to === "string" ? to : (to.pathname ?? ""));
  }) as NavigateFunction;

  return {
    urls,
    navigate,
    searchParams: new URLSearchParams(),
    setSearchParams: vi.fn(),
    setCourseTab: vi.fn(),
  };
}

describe("criarEstrategiaHierarquia", () => {
  it("goLesson navigates to lesson path", () => {
    const deps = criarDepsMock();
    const strategy = criarEstrategiaHierarquia(deps);

    strategy.goLesson("javascript", "01-fundamentals", "01.1.1-lesson");

    expect(deps.urls[0]).toBe(
      "/course/javascript/module/01-fundamentals/lesson/01.1.1-lesson",
    );
  });

  it("openLessonDrawer includes quiz query params", () => {
    const deps = criarDepsMock();
    const strategy = criarEstrategiaHierarquia(deps);

    strategy.openLessonDrawer(
      "javascript",
      "01-fundamentals",
      "01.1.1-lesson",
      "quiz",
      "quiz-id",
    );

    expect(deps.urls[0]).toContain("drawer=quiz");
    expect(deps.urls[0]).toContain("quiz=quiz-id");
  });
});
