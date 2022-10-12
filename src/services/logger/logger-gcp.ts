import { Logging } from "@google-cloud/logging";
import { injectable } from "inversify";

import type { ILogger } from "./logger";

@injectable()
export class LoggerGcp implements ILogger {
  private readonly _logging = new Logging();

  private readonly _log = this._logging.log("pixiv-to-raindrop");

  public log(...arguments_: readonly unknown[]): void {
    void this._log.write(this._log.entry({ data: arguments_ }));
  }

  public error(...arguments_: readonly unknown[]): void {
    void this._log.error(this._log.entry({ data: arguments_ }));
  }
}
