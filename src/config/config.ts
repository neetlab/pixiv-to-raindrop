export interface IConfigPixiv {
  userId: string;
  username: string;
  password: string;
}

export interface IConfigRaindrop {
  token: string;
  collection?: number;
  tags: string[];
}

export type CookieStorageType = "filesystem" | "cloud-storage";

export interface IConfigCookieStorage {
  type: CookieStorageType;
}

export type LoggerType = "stdout";

export interface IConfigLogger {
  type: LoggerType;
}

export interface IConfig {
  pixiv: IConfigPixiv;
  raindrop: IConfigRaindrop;
  cookieStorage: IConfigCookieStorage;
  logger: IConfigLogger;
  print(): void;
}
