import fs from "node:fs/promises";
import { Protocol } from "puppeteer";

import { ICookieStorage } from "./cookie-storage";

export class CookieStorageFs implements ICookieStorage {
  async read(): Promise<Protocol.Network.CookieParam[]> {
    try {
      const jsonCookie = await fs.readFile("./cookies.json", "utf-8");
      return JSON.parse(jsonCookie);
    } catch {
      return [];
    }
  }

  async save(cookies: Protocol.Network.CookieParam[]): Promise<void> {
    await fs.writeFile(
      "./cookies.json",
      JSON.stringify(cookies, null, 2),
      "utf-8"
    );
  }
}
