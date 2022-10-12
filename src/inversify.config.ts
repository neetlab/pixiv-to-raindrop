import { Container } from "inversify";
import { IConfig } from "./config/config";
import { ConfigEnv } from "./config/config-env";
import { ILogger } from "./logger/logger";
import { LoggerConsole } from "./logger/logger-console";
import { IRaindropClient, RaindropClient } from "./raindrop/api";
import { ICookieStorage } from "./storage/cookie-storage";
import { CookieStorageFs } from "./storage/cookie-storage-fs";
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
  config.print();

  container
    .bind<ICookieStorage>(TYPES.CookieStorage)
    .to(CookieStorageFs)
    .when(() => config.cookieStorage.type === "filesystem");

  container
    .bind<ILogger>(TYPES.Logger)
    .to(LoggerConsole)
    .when(() => config.logger.type === "stdout");

  container.bind<IRaindropClient>(TYPES.RaindropClient).to(RaindropClient);

  return container;
};
