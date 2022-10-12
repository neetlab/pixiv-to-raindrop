export interface IHttp {
  get: <T>(path: string, query?: unknown, init?: unknown) => Promise<T>;
  post: <T>(path: string, body?: unknown, init?: unknown) => Promise<T>;
  put: <T>(path: string, body?: unknown, init?: unknown) => Promise<T>;
}
