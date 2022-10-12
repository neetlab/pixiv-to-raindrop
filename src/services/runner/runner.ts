import { launch } from "puppeteer";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { ILogger } from "../logger/logger";
import { IConfig } from "../config/config";
import { ConfiguredInterpreter, Interpreter } from "./interpreters/interpreter";
import { IRaindropClient } from "../../libs/raindrop/raindrop";
import { RaindropClientAxios } from "../../libs/raindrop/raindrop-axios";

interface HandleBookmarksResult {
  readonly hasMore: boolean;
}

@injectable()
export class Runner {
  private readonly _raindrop: IRaindropClient;

  public constructor(
    @inject(Interpreter)
    private readonly _interpreter: Interpreter,

    @inject(TYPES.Logger)
    private readonly _logger: ILogger,

    @inject(TYPES.Config)
    private readonly _config: IConfig
  ) {
    this._raindrop = new RaindropClientAxios(this._config.raindrop.token);
  }

  public async synchronize() {
    this._logger.log(this._config);

    const browser = await launch({
      headless: true,
      args: ["--no-sandbox"],
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });
    const pixiv = this._interpreter.configure(browser);

    try {
      await pixiv.login({
        username: this._config.pixiv.username,
        password: this._config.pixiv.password,
      });

      let page = 1;
      while (true) {
        const bookmarks = await pixiv.fetchBookmarks(page);
        if (bookmarks == null) break;

        const result = await this._handleBookmarks(pixiv, bookmarks);
        this._logger.log(`Got hasMore=${result.hasMore} as a result`);

        if (!result.hasMore) break;
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
    const exists = await this._raindrop.checkUrlExistence({
      urls: rawArtworkUrls,
    });

    const duplicates = exists.duplicates.map((duplicate) => duplicate.link);
    const artworkUrls = rawArtworkUrls.filter(
      (bookmark) => !duplicates.includes(bookmark)
    );

    this._logger.log(`New bookmarks were ${artworkUrls.length}`);

    for (const artworkUrl of artworkUrls) {
      await this._handleBookmark(pixiv, artworkUrl);
    }

    return {
      // No duplicates?
      hasMore: artworkUrls.length === rawArtworkUrls.length,
    };
  }

  private async _handleBookmark(
    pixiv: ConfiguredInterpreter,
    artworkUrl: string
  ): Promise<void> {
    const artwork = await pixiv.fetchArtwork(artworkUrl);

    const { item } = await this._raindrop.createRaindrop({
      pleaseParse: {},
      link: artwork.url,
      type: "image",
      title: artwork.title,
      excerpt: artwork.description,
      tags: this._config.raindrop.tags,
      collection: {
        $id: this._config.raindrop.collection,
      },
    });

    if (artwork.thumbnail == null) {
      return;
    }

    await this._raindrop.uploadRaindropCover(item._id, {
      cover: artwork.thumbnail,
    });

    this._logger.log(`${artwork.title} was saved.`);
  }
}
