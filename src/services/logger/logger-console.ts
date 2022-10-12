/* eslint-disable no-console */
import { injectable } from "inversify";

import type { ILogger } from "./logger";

@injectable()
export class LoggerConsole implements ILogger {
  public log(...arguments_: readonly unknown[]): void {
    console.log(...arguments_);
  }

  public error(...arguments_: readonly unknown[]): void {
    console.log(...arguments_);
  }
}
