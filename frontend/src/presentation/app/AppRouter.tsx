import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { CatalogRoute } from "../features/catalog/CatalogRoute";
import { CourseExperienceRoute } from "../features/course-experience/CourseExperienceRoute";
import { ModuleExperienceRoute } from "../features/module-experience/ModuleExperienceRoute";
import { LessonWorkspaceRoute } from "../features/lesson-workspace/LessonWorkspaceRoute";
import { QuizActivityRoute } from "../features/quiz/QuizActivityRoute";
import { ProjectActivityRoute } from "../features/project-workspace/ProjectActivityRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<CatalogRoute />} />
        <Route path="/course/:courseId" element={<CourseExperienceRoute />} />
        <Route path="/course/:courseId/module/:moduleId" element={<ModuleExperienceRoute />} />
        <Route
          path="/course/:courseId/module/:moduleId/quiz/:quizId"
          element={<QuizActivityRoute />}
        />
        <Route
          path="/course/:courseId/module/:moduleId/lesson/:lessonId"
          element={<LessonWorkspaceRoute />}
        />
        <Route
          path="/course/:courseId/module/:moduleId/lesson/:lessonId/quiz/:quizId"
          element={<QuizActivityRoute />}
        />
        <Route
          path="/course/:courseId/module/:moduleId/lesson/:lessonId/project/:projectId"
          element={<ProjectActivityRoute />}
        />
      </Route>
    </Routes>
  );
}
