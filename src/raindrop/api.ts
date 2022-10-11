import axios, { AxiosInstance } from "axios";

export interface IRaindropClient {
  get<T>(path: string, query?: unknown, init?: unknown): Promise<T>;
  post<T>(path: string, body?: unknown, init?: unknown): Promise<T>;
  put<T>(path: string, body?: unknown, init?: unknown): Promise<T>;
}

export class RaindropClient implements IRaindropClient {
  private readonly _axios: AxiosInstance;

  public constructor(token: string) {
    this._axios = axios.create({
      baseURL: "https://api.raindrop.io",
      headers: {
        Authorization: `Bearer ${token}`,
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
