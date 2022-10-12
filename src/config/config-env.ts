import axios from "axios";
import { CookieStorageType, IConfig, LoggerType } from "./config";
import { BaseConfig, BaseConfigParameters } from "./config-base";

const PIXIV_USER_PAGE = /^https:\/\/www\.pixiv\.net\/users\/(.+?)$/;

const env = <T = string>(name: string): T | undefined => {
  return process.env[name] as T | undefined;
};

export class ConfigEnv extends BaseConfig implements IConfig {
  private constructor(config: BaseConfigParameters) {
    super(config);
  }

  public static async create(): Promise<ConfigEnv> {
    const pixivUsername = env("PIXIV_USERNAME");
    const pixivUserId = await axios
      .get(`https://pixiv.me/${pixivUsername}`)
      .then((response) => response.request?.res.responseUrl)
      .then((url: string) => url.match(PIXIV_USER_PAGE)?.at(1));

    if (pixivUserId == null) {
      throw new Error(`Could not infer Pixiv user id from username`);
    }

    const raindropTags = env("RAINDROP_TAGS");

    const partial = {
      pixiv: {
        userId: pixivUserId,
        username: pixivUsername,
        password: env("PIXIV_PASSWORD"),
      },
      raindrop: {
        token: env("RAINDROP_TOKEN"),
        collection: Number(env("RAINDROP_COLLECTION")),
        tags: raindropTags != null ? raindropTags.split(",") : undefined,
      },
      cookieStorage: {
        type: env<CookieStorageType>("COOKIE_STORAGE_TYPE"),
      },
      logger: {
        type: env<LoggerType>("LOGGER_TYPE"),
      },
    };

    return new ConfigEnv(partial);
  }
}
