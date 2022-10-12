import type { RaindropType } from "./schemas";

/**
 * @see https://developer.raindrop.io/v1/raindrops
 */
export interface CreateRaindropParameters {
  readonly created?: string;
  readonly lastUpdate?: string;
  readonly order?: number;
  readonly pleaseParse?: unknown;
  readonly important?: boolean;
  readonly tags?: readonly string[];
  readonly media?: readonly unknown[];
  readonly cover?: string;
  readonly collection?: {
    readonly $id?: number;
  };
  readonly type?: RaindropType;
  readonly excerpt?: string;
  readonly title?: string;
  readonly link: string;
  readonly highlights?: readonly unknown[];
}

export interface CheckUrlExistenceParameters {
  readonly urls: readonly string[];
}

export interface UploadRaindropCoverParameters {
  readonly cover: unknown;
}
