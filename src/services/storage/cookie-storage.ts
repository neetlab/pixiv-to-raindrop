import { Protocol } from "puppeteer";

export interface ICookieStorage {
  read(): Promise<Protocol.Network.CookieParam[]>;
  save(cookies: Protocol.Network.CookieParam[]): Promise<void>;
}
