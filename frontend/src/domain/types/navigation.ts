export type CourseTab = "readme" | "examples" | "projects" | "quiz";

export type DrawerMode = "quiz" | "project";

export type DrawerTab = "explanation" | "files" | "delivery";

export type Route =
  | { name: "catalog" }
  | { name: "course"; courseId: string }
  | { name: "module"; courseId: string; moduleId: string }
  | {
      name: "lesson";
      courseId: string;
      moduleId: string;
      lessonId: string;
      drawer?: DrawerMode;
    }
  | { name: "courseLegacy"; courseId: string; tab?: CourseTab };
