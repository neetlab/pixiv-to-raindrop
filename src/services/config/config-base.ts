import type { PartialDeep } from "type-fest";

import type {
  IConfig,
  IConfigCookieStorage,
  IConfigLogger,
  IConfigPixiv,
  IConfigRaindrop,
} from "./config";

const nonNull = <T>(value: T | null | undefined, message: string): T => {
  if (value == null) {
    throw new TypeError(message);
  }
  return value;
};

export type BaseConfigParameters = PartialDeep<IConfig>;

export abstract class BaseConfig implements IConfig {
  public readonly pixiv: IConfigPixiv;

  public readonly raindrop: IConfigRaindrop;

  public readonly cookieStorage: IConfigCookieStorage;

  public readonly logger: IConfigLogger;

  protected constructor(properties: BaseConfigParameters) {
    this.pixiv = {
      userId: nonNull(properties.pixiv?.userId, "pixiv.userId can't be null"),
      username: nonNull(
        properties.pixiv?.username,
        "pixiv.username can't be null"
      ),
      password: nonNull(
        properties.pixiv?.password,
        "pixiv.password can't be null"
      ),
    };
    this.raindrop = {
      token: nonNull(
        properties.raindrop?.token,
        "raindrop.token can't be null"
      ),
      collection: properties.raindrop?.collection,
      tags: properties.raindrop?.tags ?? [],
    };
    this.cookieStorage = {
      type: properties.cookieStorage?.type ?? "filesystem",
      bucket: properties.cookieStorage?.bucket ?? "pixiv-to-raindrop",
    };
    this.logger = {
      type: properties.logger?.type ?? "stdout",
      name: properties.logger?.name ?? "pixiv-to-raindrop",
    };
  }
}
