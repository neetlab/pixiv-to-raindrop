import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import { IHttp } from "./http";

export class HttpAxios implements IHttp {
  private readonly _axios: AxiosInstance;

  public constructor(config: CreateAxiosDefaults) {
    this._axios = axios.create(config);
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
