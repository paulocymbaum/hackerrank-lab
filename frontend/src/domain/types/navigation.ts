export type CourseTab = "readme" | "examples" | "projects" | "quiz";

export type Route =
  | { name: "catalog" }
  | { name: "course"; courseId: string; tab?: CourseTab };
