import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { CatalogRoute } from "../features/catalog/CatalogRoute";
import { CourseExperienceRoute } from "../features/course-experience/CourseExperienceRoute";
import { ModuleExperienceRoute } from "../features/module-experience/ModuleExperienceRoute";
import { LessonWorkspaceRoute } from "../features/lesson-workspace/LessonWorkspaceRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<CatalogRoute />} />
        <Route path="/course/:courseId" element={<CourseExperienceRoute />} />
        <Route path="/course/:courseId/module/:moduleId" element={<ModuleExperienceRoute />} />
        <Route
          path="/course/:courseId/module/:moduleId/lesson/:lessonId"
          element={<LessonWorkspaceRoute />}
        />
      </Route>
    </Routes>
  );
}
