/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { Bucket } from "@google-cloud/storage";
import { Storage } from "@google-cloud/storage";
import { inject, injectable } from "inversify";
import type { Protocol } from "puppeteer";

import { TYPES } from "../../types";
import { IConfig } from "../config/config";
import type { ICookieStorage } from "./cookie-storage";

@injectable()
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

  public async save(
    cookies: readonly Protocol.Network.CookieParam[]
  ): Promise<void> {
    const file = this._bucket.file(this._FILENAME);
    await file.save(JSON.stringify(cookies, null, 2));
  }

  public async read(): Promise<Protocol.Network.CookieParam[]> {
    const file = this._bucket.file(this._FILENAME);
    const filePath = path.join(os.tmpdir(), this._FILENAME);
    const [exists] = await file.exists();

    if (!exists) {
      return [];
    }

    await file.download({ destination: filePath });
    const jsonBuffer = await fs.readFile(filePath);
    return JSON.parse(jsonBuffer.toString()) as Protocol.Network.CookieParam[];
  }
}
