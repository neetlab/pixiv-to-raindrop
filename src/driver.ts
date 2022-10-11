import FormData from "form-data";
import { launch } from "puppeteer";
import { ConfigEnv } from "./config/cofnig-env";
import { LoginHandler } from "./handlers/login-handler";
import { ArtworkInterpreter } from "./interpreters/artwork-interperter";
import { UserInterpreter } from "./interpreters/user-interpreter";
import { LoggerConsole } from "./logger/logger-console";
import { RaindropClient } from "./raindrop/api";
import { raindrop } from "./raindrop/schemas";
import { CookieStorageFs } from "./storage/cookie-storage-fs";

const handleBookmarks =
  (
    raindrop: RaindropClient,
    artworkInterpreter: ArtworkInterpreter,
    config: ConfigEnv,
    logger: LoggerConsole
  ) =>
  async (bookmarks: string[]): Promise<boolean> => {
    const exists = await raindrop.post<raindrop.v1._import.url.exists>(
      "/rest/v1/import/url/exists",
      { urls: bookmarks }
    );
    const duplicates = exists.duplicates.map((duplicate) => duplicate.link);
    const newBookmarks = bookmarks.filter(
      (bookmark) => !duplicates.includes(bookmark)
    );

    logger.log(`New bookmarks were ${newBookmarks.length}`);

    for (const bookmark of newBookmarks) {
      const artwork = await artworkInterpreter.interpret(bookmark);
      const { item } = await raindrop.post<{ item: { _id: number } }>(
        "/rest/v1/raindrop",
        {
          pleaseParse: {},
          link: artwork.url,
          type: "image",
          title: artwork.title,
          excerpt: artwork.description,
          tags: config.raindrop.tags,
          collection: {
            $id: config.raindrop.collection,
          },
        }
      );

      if (artwork.thumbnail == null) {
        continue;
      }

      const formData = new FormData();
      formData.append("cover", artwork.thumbnail);

      await raindrop.put(`/rest/v1/raindrop/${item._id}/cover`, formData, {
        headers: formData.getHeaders(),
      });

      logger.log(`${artwork.title} was saved.`);
    }

    return newBookmarks.length === 0;
  };

const main = async (): Promise<void> => {
  const browser = await launch({
    headless: true,
    args: ['--no-sandbox'],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  const config = new ConfigEnv();
  const raindrop = new RaindropClient(config.raindrop.token);
  const logger = new LoggerConsole();
  const storage = new CookieStorageFs();

  const loginHandler = new LoginHandler(browser, config, storage, logger);
  const userInterpreter = new UserInterpreter(browser, logger);
  const artworkInterpreter = new ArtworkInterpreter(browser);

  await loginHandler.login();

  for await (const user of userInterpreter.interpret(config.pixiv.username)) {
    const done = await handleBookmarks(
      raindrop,
      artworkInterpreter,
      config,
      logger
    )(user.bookmarks);

    logger.log(`Got ${done} as result`);

    if (done) {
      return;
    }
  }

  await browser.close();
};

main().catch((error) => {
  throw error;
});
