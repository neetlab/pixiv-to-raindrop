import { injectable } from "inversify";
import { Browser, Page } from "puppeteer";

export interface Artwork {
  url: string;
  title?: string;
  description?: string;
  thumbnail?: Buffer;
}

/**
 * 個別ページのパーサー
 */
@injectable()
export class ArtworkInterpreter {
  public async fetchArtwork(browser: Browser, url: string): Promise<Artwork> {
    const page = await browser.newPage();

    try {
      await page.goto(url);

      return {
        url: page.url(),
        title: (await this._fetchTitle(page)) ?? undefined,
        description: (await this._fetchDescription(page)) ?? undefined,
        thumbnail: await this._fetchThumbnail(page),
      };
    } finally {
      await page.close();
    }
  }

  private async _fetchTitle(page: Page): Promise<string | null> {
    try {
      await page.waitForSelector('meta[property="og:title"]');
      return await page.$eval('meta[property="og:title"]', (elm) =>
        elm.getAttribute("content")
      );
    } catch {
      return null;
    }
  }

  private async _fetchDescription(page: Page): Promise<string | null> {
    try {
      await page.waitForSelector('meta[property="og:description"]');
      return await page.$eval('meta[property="og:description"]', (elm) =>
        elm.getAttribute("content")
      );
    } catch {
      return null;
    }
  }

  private async _fetchThumbnail(page: Page): Promise<Buffer | undefined> {
    try {
      await page.waitForSelector("figure img");

      const image = await page.$("figure img");
      if (image == null) {
        return;
      }

      return (await image.screenshot()) as Buffer;
    } catch {
      return;
    }
  }
}
