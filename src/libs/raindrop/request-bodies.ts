import { RaindropType } from "./schemas";

/**
 * @see https://developer.raindrop.io/v1/raindrops
 */
export interface CreateRaindropParameters {
  created?: string;
  lastUpdate?: string;
  order?: number;
  pleaseParse?: unknown;
  important?: boolean;
  tags?: string[];
  media?: unknown[];
  cover?: string;
  collection?: {
    $id?: number;
  };
  type?: RaindropType;
  excerpt?: string;
  title?: string;
  link: string;
  highlights?: unknown[];
}

export interface CheckUrlExistenceParameters {
  urls: string[];
}

export interface UploadRaindropCoverParameters {
  cover: unknown;
}
