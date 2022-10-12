export interface ILogger {
  log(...args: unknown[]): unknown;
  error(...args: unknown[]): unknown;
}
