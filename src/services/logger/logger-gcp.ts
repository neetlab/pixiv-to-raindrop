import { Logging } from "@google-cloud/logging";
import { injectable } from "inversify";
import { ILogger } from "./logger";

@injectable()
export class LoggerGcp implements ILogger {
  private readonly _logging = new Logging();
  private readonly _log = this._logging.log("pixiv-to-raindrop");

  public log(...args: unknown[]): void {
    this._log.write(this._log.entry({ data: args }));
  }

  public error(...args: unknown[]): void {
    this._log.error(this._log.entry({ data: args }));
  }
}
