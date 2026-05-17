import { LEVEL_MAP } from "../data/levelMap";

export function setLevelClassName(level: string): string {
  const matched = LEVEL_MAP.find(({ key }) => level.includes(key));
  const levelClassName = matched ? matched.className : "";
  return levelClassName;
}

export function removeHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}
