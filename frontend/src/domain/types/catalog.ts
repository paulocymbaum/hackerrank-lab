export type Catalog = {
  courses: Course[];
};

export type Course = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Lesson = {
  title: string;
  path: string;
};

