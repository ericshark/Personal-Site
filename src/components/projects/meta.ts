import {
  type Project,
  type ProjectCategoryId,
  projectCategories,
} from "@/data/portfolio";

export const categoryLabel = Object.fromEntries(
  projectCategories.map((category) => [category.id, category.label]),
) as Record<ProjectCategoryId, string>;

export const statusStyles: Record<Project["status"], string> = {
  shipped: "bg-emerald-500",
  "in progress": "bg-amber-500 animate-[pv-pulse_1.8s_ease-in-out_infinite]",
  concept: "border border-neutral-400 bg-transparent",
};

/** Inline style that feeds a project's hue to `.accent-scope`. */
export function hueStyle(project: Project) {
  return { "--hue": project.hue } as React.CSSProperties;
}
