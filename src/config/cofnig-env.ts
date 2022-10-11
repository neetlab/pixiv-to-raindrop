import { IConfig } from "./config";

// const env = process.env;

const env = (name: string): string => {
  const value = process.env[name];
  if (value == null) {
    throw new Error(`Environment variable ${name} is not set`);
  }

  return value;
};

export class ConfigEnv implements IConfig {
  public pixiv = {
    username: env("PIXIV_USERNAME"),
    password: env("PIXIV_PASSWORD"),
  };

  public raindrop = {
    token: env("RAINDROP_TOKEN"),
    collection: Number(env("RAINDROP_COLLECTION")),
    tags: env("RAINDROP_TAGS").split(","),
  };
}
