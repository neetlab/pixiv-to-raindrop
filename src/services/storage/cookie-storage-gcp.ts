import path from "path";
import fs from "fs/promises";
import os from "os";
import { inject } from "inversify";
import { Storage, Bucket } from "@google-cloud/storage";

import { IConfig } from "../config/config";
import { TYPES } from "../../types";
import { ICookieStorage } from "./cookie-storage";
import { Protocol } from "puppeteer";

export class CookieStorageGcp implements ICookieStorage {
  private readonly _FILENAME = "cookies.json";
  private readonly _storage = new Storage();
  private readonly _bucket: Bucket;

  public constructor(
    @inject(TYPES.Config)
    private readonly _config: IConfig
  ) {
    this._bucket = this._storage.bucket(this._config.cookieStorage.bucket);
  }

  async save(cookies: Protocol.Network.CookieParam[]): Promise<void> {
    const file = this._bucket.file(this._FILENAME);
    await file.save(JSON.stringify(cookies, null, 2));
  }

  async read(): Promise<Protocol.Network.CookieParam[]> {
    const file = this._bucket.file(this._FILENAME);
    const filePath = path.join(os.tmpdir(), this._FILENAME);
    await file.download({ destination: filePath });
    const json = await fs.readFile(filePath, "utf-8");
    return JSON.parse(json);
  }
}
