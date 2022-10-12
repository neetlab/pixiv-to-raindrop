export interface ILogger {
  readonly log: (...arguments_: readonly unknown[]) => unknown;
  readonly error: (...arguments_: readonly unknown[]) => unknown;
}
