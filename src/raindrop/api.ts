import axios, { AxiosInstance } from "axios";
import { inject, injectable } from "inversify";
import { IConfig } from "../config/config";
import { TYPES } from "../types";

export interface IRaindropClient {
  get<T>(path: string, query?: unknown, init?: unknown): Promise<T>;
  post<T>(path: string, body?: unknown, init?: unknown): Promise<T>;
  put<T>(path: string, body?: unknown, init?: unknown): Promise<T>;
}

@injectable()
export class RaindropClient implements IRaindropClient {
  private readonly _axios: AxiosInstance;

  public constructor(
    @inject(TYPES.Config)
    config: IConfig
  ) {
    this._axios = axios.create({
      baseURL: "https://api.raindrop.io",
      headers: {
        Authorization: `Bearer ${config.raindrop.token}`,
      },
    });
  }

  public get<T>(
    path: string,
    params: unknown,
    init: Record<string, unknown> = {}
  ): Promise<T> {
    return this._axios.get(path, { params, ...init }).then((d) => d.data);
  }

  public post<T>(
    path: string,
    data: unknown,
    init: Record<string, unknown> = {}
  ): Promise<T> {
    return this._axios.post(path, data, init).then((d) => d.data);
  }

  public put<T>(
    path: string,
    data: unknown,
    init: Record<string, unknown> = {}
  ): Promise<T> {
    return this._axios.put(path, data, init).then((d) => d.data);
  }
}
