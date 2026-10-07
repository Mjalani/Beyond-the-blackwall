export type { BookPage, PageKind, SceneKind } from "./types";
import type { BookPage } from "./types";
import book from "../content/book.json";

export const pages = book.pages as unknown as BookPage[];
