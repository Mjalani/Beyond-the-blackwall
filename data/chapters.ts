export type { BookPage, PageKind, SceneKind } from "./types";
import { coverPages } from "./cover";
import { chapterOnePages } from "./chapter-01";
import { chapterTwoPages } from "./chapter-02";
import { chapterThreePartOnePages } from "./chapter-03a";
import { chapterThreePartTwoPages } from "./chapter-03b";
import { chapterFourTeaserPages } from "./chapter-04-teaser";

export const pages = [
  ...coverPages,
  ...chapterOnePages,
  ...chapterTwoPages,
  ...chapterThreePartOnePages,
  ...chapterThreePartTwoPages,
  ...chapterFourTeaserPages,
];
