/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { inject, injectable } from "inversify";
import type { Browser, Page } from "puppeteer";

import { TYPES } from "../../../types";
import { IConfig } from "../../config/config";
import { ILogger } from "../../logger/logger";

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
    pageNumber = 1
  ): Promise<string[] | undefined> {
    const page = await browser.newPage();

    try {
      const search = new URLSearchParams({ p: pageNumber.toString() });
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
        `${pageNumber}th page. ${bookmarks.length} bookmarks found`
      );
      return bookmarks;
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
      const artworkUrl = new URL(pathname, page.url());
      return artworkUrl.href;
    });

    return links;
  }
}
