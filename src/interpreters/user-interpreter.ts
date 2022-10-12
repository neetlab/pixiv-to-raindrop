import { inject, injectable } from "inversify";
import { Browser, Page } from "puppeteer";
import { IConfig } from "../config/config";
import { ILogger } from "../logger/logger";
import { TYPES } from "../types";

@injectable()
export class UserInterpreter {
  public constructor(
    @inject(TYPES.Logger)
    private readonly _logger: ILogger,

    @inject(TYPES.Config)
    private readonly _config: IConfig
  ) {}

  public async fetchBookmarks(
    browser: Browser,
    pageNum: number = 1
  ): Promise<string[] | undefined> {
    const page = await browser.newPage();

    try {
      const search = new URLSearchParams({ p: pageNum.toString() });
      await page.goto(
        `https://www.pixiv.net/users/${
          this._config.pixiv.userId
        }/bookmarks/artworks?${search.toString()}`
      );

      const bookmarks = await this._findArtworkLinks(page);
      if (bookmarks.length === 0) {
        return;
      }

      this._logger.log(
        `${pageNum}th page. ${bookmarks.length} bookmarks found`
      );
    } finally {
      await page.close();
    }
  }

  private async _findArtworkLinks(page: Page): Promise<string[]> {
    await page.waitForSelector("ul > li label a");
    const pathnames = await page.$$eval("ul > li label a", (elements) =>
      elements
        .map((element) => element.getAttribute("href"))
        .filter((href): href is string => href != null)
    );

    const links = pathnames.map((pathname) => {
      const url = new URL(page.url());
      url.pathname = pathname;
      return url.href;
    });

    return links;
  }
}
