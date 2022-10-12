import FormData from "form-data";
import { launch } from "puppeteer";
import { RaindropClient } from "./raindrop/api";
import { raindrop } from "./raindrop/schemas";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import { ILogger } from "./logger/logger";
import { IConfig } from "./config/config";
import { ConfiguredInterpreter, Interpreter } from "./interpreters/interpreter";

interface HandleBookmarksResult {
  readonly hasMore: boolean;
}

@injectable()
export class Driver {
  public constructor(
    @inject(Interpreter)
    private readonly _interpreter: Interpreter,

    @inject(TYPES.RaindropClient)
    private readonly _raindrop: RaindropClient,

    @inject(TYPES.Logger)
    private readonly _logger: ILogger,

    @inject(TYPES.Config)
    private readonly _config: IConfig
  ) {}

  public async synchronize() {
    const browser = await launch({
      headless: false,
      args: ["--no-sandbox"],
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });
    const pixiv = this._interpreter.configure(browser);

    try {
      await pixiv.login();

      let page = 1;
      while (true) {
        const bookmarks = await pixiv.fetchBookmarks(page);
        if (bookmarks == null) {
          break;
        }

        const done = await this._handleBookmarks(pixiv, bookmarks);

        this._logger.log(`Got ${done} as result`);
        if (done) break;
        page += 1;
      }

      this._logger.log("Terminating");
    } catch (error) {
      this._logger.error(error);
    } finally {
      await browser.close();
    }
  }

  private async _handleBookmarks(
    pixiv: ConfiguredInterpreter,
    rawArtworkUrls: string[]
  ): Promise<HandleBookmarksResult> {
    const exists = await this._raindrop.post<raindrop.v1._import.url.exists>(
      "/rest/v1/import/url/exists",
      { urls: rawArtworkUrls }
    );
    const duplicates = exists.duplicates.map((duplicate) => duplicate.link);
    const artworkUrls = rawArtworkUrls.filter(
      (bookmark) => !duplicates.includes(bookmark)
    );

    this._logger.log(`New bookmarks were ${artworkUrls.length}`);

    for (const artworkUrl of artworkUrls) {
      this._handleBookmark(pixiv, artworkUrl);
    }

    return {
      hasMore: artworkUrls.length > 0,
    };
  }

  private async _handleBookmark(
    pixiv: ConfiguredInterpreter,
    artworkUrl: string
  ): Promise<void> {
    const artwork = await pixiv.fetchArtwork(artworkUrl);

    const { item } = await this._raindrop.post<{ item: { _id: number } }>(
      "/rest/v1/raindrop",
      {
        pleaseParse: {},
        link: artwork.url,
        type: "image",
        title: artwork.title,
        excerpt: artwork.description,
        tags: this._config.raindrop.tags,
        collection: {
          $id: this._config.raindrop.collection,
        },
      }
    );

    if (artwork.thumbnail == null) {
      return;
    }

    const formData = new FormData();
    formData.append("cover", artwork.thumbnail);

    await this._raindrop.put(`/rest/v1/raindrop/${item._id}/cover`, formData, {
      headers: formData.getHeaders(),
    });

    this._logger.log(`${artwork.title} was saved.`);
  }
}
