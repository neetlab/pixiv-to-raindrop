/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Protocol } from "puppeteer";

export interface ICookieStorage {
  readonly read: () => Promise<Protocol.Network.CookieParam[]>;
  readonly save: (
    cookies: readonly Protocol.Network.CookieParam[]
  ) => Promise<void>;
}
