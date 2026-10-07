export type PageKind = "text" | "plate";
export type SceneKind =
  | "cover"
  | "city"
  | "swarm"
  | "blackwall"
  | "chorus"
  | "optimizer"
  | "cinder"
  | "lantern"
  | "deep"
  | "bunker"
  | "seal";

export type BookPage = {
  id: string;
  kind?: PageKind;
  chapter: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  kicker?: string;
  scene?: SceneKind;
  plateQuote?: string;
  plateCredit?: string;
};
