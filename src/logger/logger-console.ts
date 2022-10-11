import { ILogger } from "./logger";

export class LoggerConsole implements ILogger {
  public log(...args: unknown[]): void {
    console.log(...args);
  }
}
