import type { IRaindrop } from "./schemas";

export interface CreateRaindropResponse {
  result: boolean;
  item: IRaindrop;
}

export interface CheckUrlExistenceResponse {
  result: boolean;
  ids: string[];
  duplicates: {
    _id: number;
    link: string;
  }[];
}

export interface UploadRaindropCoverResponse {
  cover: string;
  media: {
    link: string;
  }[];
}
