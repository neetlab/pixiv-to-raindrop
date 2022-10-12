import axios from "axios";

import type { CookieStorageType, IConfig, LoggerType } from "./config";
import type { BaseConfigParameters } from "./config-base";
import { BaseConfig } from "./config-base";

const PIXIV_USER_PAGE = /^https:\/\/www\.pixiv\.net\/users\/(.+?)$/;

const environment = <T = string>(name: string): T | undefined => {
  return process.env[name] as T | undefined;
};

export class ConfigEnvironment extends BaseConfig implements IConfig {
  private constructor(config: BaseConfigParameters) {
    super(config);
  }

  public static async create(): Promise<ConfigEnvironment> {
    const pixivUsername = environment("PIXIV_USERNAME");
    if (pixivUsername == null) {
      throw new Error("pixiv.username cannot be null");
    }

    const pixivUserId = await axios
      .get(`https://pixiv.me/${pixivUsername}`)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .then((response) => response.request?.res.responseUrl as string)
      .then((url: string) => PIXIV_USER_PAGE.exec(url)?.at(1));

    if (pixivUserId == null) {
      throw new Error(`Could not infer Pixiv user id from username`);
    }

    const raindropTags = environment("RAINDROP_TAGS");

    const partial = {
      pixiv: {
        userId: pixivUserId,
        username: pixivUsername,
        password: environment("PIXIV_PASSWORD"),
      },
      raindrop: {
        token: environment("RAINDROP_TOKEN"),
        collection: Number(environment("RAINDROP_COLLECTION")),
        tags: raindropTags != null ? raindropTags.split(",") : undefined,
      },
      cookieStorage: {
        type: environment<CookieStorageType>("COOKIE_STORAGE_TYPE"),
        bucket: environment("COOKIE_STORAGE_BUCKET"),
      },
      logger: {
        type: environment<LoggerType>("LOGGER_TYPE"),
        name: environment("LOGGER_NAME"),
      },
    };

    return new ConfigEnvironment(partial);
  }
}
