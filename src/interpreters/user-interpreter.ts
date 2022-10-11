import { Browser, Page } from "puppeteer";
import { ILogger } from "../logger/logger";

export interface User {
  readonly bookmarks: string[];
}

export class UserInterpreter {
  public constructor(
    private readonly _browser: Browser,
    private readonly _logger: ILogger
  ) {}

  public async *interpret(username: string): AsyncIterable<User> {
    const page = await this._browser.newPage();

    try {
      await page.goto(`https://pixiv.me/${username}`);
      await page.waitForSelector("aria/ブックマーク[role='link']");
      await Promise.all([
        page.click("aria/ブックマーク[role='link']"),
        page.waitForNavigation(),
      ]);
    } catch {
      throw new Error("No bookmarks found");
    }

    let index = 1;

    while (true) {
      const bookmarks = await this._fetchBookmarks(page);
      if (bookmarks.length === 0) {
        break;
      }

      this._logger.log(`${index}th page. ${bookmarks.length} bookmarks found`);
      yield { bookmarks };

      index += 1;
      const nextUrl = new URL(page.url());
      nextUrl.searchParams.set("p", index.toString());
      await page.goto(nextUrl.toString());
    }

    await page.close();
  }

  private async _fetchBookmarks(page: Page): Promise<string[]> {
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
