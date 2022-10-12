export interface IConfigPixiv {
  readonly userId: string;
  readonly username: string;
  readonly password: string;
}

export interface IConfigRaindrop {
  readonly token: string;
  readonly collection?: number;
  readonly tags: readonly string[];
}

export type CookieStorageType = "cloud-storage" | "filesystem";

export interface IConfigCookieStorage {
  readonly type: CookieStorageType;
  readonly bucket: string;
}

export type LoggerType = "cloud-logging" | "stdout";

export interface IConfigLogger {
  readonly type: LoggerType;
  readonly name: string;
}

export interface IConfig {
  readonly pixiv: IConfigPixiv;
  readonly raindrop: IConfigRaindrop;
  readonly cookieStorage: IConfigCookieStorage;
  readonly logger: IConfigLogger;
}
