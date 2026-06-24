import { createContext, useContext } from "react";
import type { Course, Module } from "../../../domain/types/catalog";

export type ModuleLayoutContextValue = {
  courseId: string;
  moduleId: string;
  course: Course;
  module: Module;
};

const ModuleLayoutContext = createContext<ModuleLayoutContextValue | null>(null);

export function ModuleLayoutProvider(props: {
  value: ModuleLayoutContextValue;
  children: React.ReactNode;
}) {
  return (
    <ModuleLayoutContext.Provider value={props.value}>
      {props.children}
    </ModuleLayoutContext.Provider>
  );
}

export function useModuleLayoutContext(): ModuleLayoutContextValue {
  const ctx = useContext(ModuleLayoutContext);
  if (!ctx) {
    throw new Error("useModuleLayoutContext must be used within ModuleLayoutProvider");
  }
  return ctx;
}
