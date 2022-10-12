import type { AxiosInstance, CreateAxiosDefaults } from "axios";
import axios from "axios";

import type { IHttp } from "./http";

export class HttpAxios implements IHttp {
  private readonly _axios: AxiosInstance;

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  public constructor(config: CreateAxiosDefaults) {
    this._axios = axios.create(config);
  }

  public async get<T>(
    path: string,
    parameters: unknown,
    init: Record<string, unknown> = {}
  ): Promise<T> {
    return this._axios
      .get<T>(path, { params: parameters, ...init })
      .then((d) => d.data);
  }

  public async post<T>(
    path: string,
    data: unknown,
    init: Record<string, unknown> = {}
  ): Promise<T> {
    return this._axios.post<T>(path, data, init).then((d) => d.data);
  }

  public async put<T>(
    path: string,
    data: unknown,
    init: Record<string, unknown> = {}
  ): Promise<T> {
    return this._axios.put<T>(path, data, init).then((d) => d.data);
  }
}
