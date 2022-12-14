export interface IRaindropCollection {
  $id: number;
}

export interface IRaindropMedia {
  link: string;
}

export type RaindropType =
  | "article"
  | "audio"
  | "document"
  | "image"
  | "link"
  | "video";

export interface IRaindropUser {
  $id: string;
}

export interface IRaindrop {
  _id: number;
  collection: IRaindropCollection;
  cover: string;
  created: string;
  domain: string;
  excerpt: string;
  lastUpdate: string;
  link: string;
  media: IRaindropMedia[];
  tags: string[];
  title: string;
  type: RaindropType;
  user: IRaindropUser;
}
