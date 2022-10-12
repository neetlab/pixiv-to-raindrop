export interface IHttp {
  get: <T>(
    path: string,
    query?: unknown,
    init?: Readonly<Record<string, unknown>>
  ) => Promise<T>;

  post: <T>(
    path: string,
    body?: unknown,
    init?: Readonly<Record<string, unknown>>
  ) => Promise<T>;

  put: <T>(
    path: string,
    body?: unknown,
    init?: Readonly<Record<string, unknown>>
  ) => Promise<T>;
}
