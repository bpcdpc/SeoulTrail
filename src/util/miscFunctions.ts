import { COURSE_LEVELS } from "../data/mapConstants";
import { TAILWIND_COLORS } from "../data/mapConstants";

export function setLevelClassName(level: string): string {
  const matched = COURSE_LEVELS.find(({ key }) => level.includes(key));
  const levelClassName = matched ? matched.className : "";
  return levelClassName;
}

export function removeHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

export function getRandomTailwindColor(step: string): string {
  const pallete = TAILWIND_COLORS.map(
    (item) => item[step as keyof typeof item],
  );
  const randomIndex = Math.floor(Math.random() * pallete.length);
  return pallete[randomIndex];
}
