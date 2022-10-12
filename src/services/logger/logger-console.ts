import { injectable } from "inversify";
import { ILogger } from "./logger";

@injectable()
export class LoggerConsole implements ILogger {
  public log(...args: unknown[]): void {
    console.log(...args);
  }

  public error(...args: unknown[]): void {
    console.log(...args);
  }
}
