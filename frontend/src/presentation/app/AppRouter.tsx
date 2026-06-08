import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { CatalogRoute } from "../features/catalog/CatalogRoute";
import { CourseExperienceRoute } from "../features/course-experience/CourseExperienceRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<CatalogRoute />} />
        <Route path="/course/:courseId" element={<CourseExperienceRoute />} />
      </Route>
    </Routes>
  );
}
