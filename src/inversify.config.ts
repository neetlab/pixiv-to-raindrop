import { Container } from "inversify";
import { IConfig } from "./services/config/config";
import { ConfigEnv } from "./services/config/config-env";
import { ILogger } from "./services/logger/logger";
import { LoggerConsole } from "./services/logger/logger-console";
import { LoggerGcp } from "./services/logger/logger-gcp";
import { ICookieStorage } from "./services/storage/cookie-storage";
import { CookieStorageFs } from "./services/storage/cookie-storage-fs";
import { CookieStorageGcp } from "./services/storage/cookie-storage-gcp";
import { TYPES } from "./types";

export const getContainer = async (): Promise<Container> => {
  const container = new Container({
    skipBaseClassChecks: true,
    autoBindInjectable: true,
  });

  container
    .bind<IConfig>(TYPES.Config)
    .toConstantValue(await ConfigEnv.create());

  const config = container.get<IConfig>(TYPES.Config);

  container
    .bind<ICookieStorage>(TYPES.CookieStorage)
    .to(CookieStorageFs)
    .when(() => config.cookieStorage.type === "filesystem");

  container
    .bind<ICookieStorage>(TYPES.CookieStorage)
    .to(CookieStorageGcp)
    .when(() => config.cookieStorage.type === "cloud-storage");

  container
    .bind<ILogger>(TYPES.Logger)
    .to(LoggerConsole)
    .when(() => config.logger.type === "stdout");

  container
    .bind<ILogger>(TYPES.Logger)
    .to(LoggerGcp)
    .when(() => config.logger.type === "cloud-logging");

  return container;
};
