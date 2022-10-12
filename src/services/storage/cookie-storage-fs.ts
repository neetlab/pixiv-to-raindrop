/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import fs from "node:fs/promises";

import { injectable } from "inversify";
import type { Protocol } from "puppeteer";

import type { ICookieStorage } from "./cookie-storage";

@injectable()
export class CookieStorageFs implements ICookieStorage {
  public async read(): Promise<Protocol.Network.CookieParam[]> {
    try {
      const jsonBuffer = await fs.readFile("./cookies.json");
      return JSON.parse(
        jsonBuffer.toString()
      ) as Protocol.Network.CookieParam[];
    } catch {
      return [];
    }
  }

  public async save(
    cookies: readonly Protocol.Network.CookieParam[]
  ): Promise<void> {
    await fs.writeFile(
      "./cookies.json",
      JSON.stringify(cookies, null, 2),
      "utf8"
    );
  }
}
