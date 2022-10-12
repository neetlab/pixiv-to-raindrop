import { inject, injectable } from "inversify";
import { Browser, Page } from "puppeteer";
import { IConfig } from "../../config/config";
import { ILogger } from "../../logger/logger";
import { ICookieStorage } from "../../storage/cookie-storage";
import { TYPES } from "../../../types";

const LOGIN_URL = "https://accounts.pixiv.net/login";

@injectable()
export class LoginInterpreter {
  public constructor(
    @inject(TYPES.Config)
    private readonly _config: IConfig,

    @inject(TYPES.CookieStorage)
    private readonly _storage: ICookieStorage,

    @inject(TYPES.Logger)
    private readonly _logger: ILogger
  ) {}

  async login(browser: Browser): Promise<void> {
    const page = await browser.newPage();

    try {
      await this._restore(page);
      await this._loginByPassword(page);
      await this._save(page);
    } finally {
      await page.close();
    }
  }

  private async _loginByPassword(page: Page) {
    this._logger.log("Logging into pixiv...");
    await page.goto(LOGIN_URL);
    if (page.url() !== LOGIN_URL) {
      this._logger.log("Session found. Skipped...");
      return;
    }

    await page.type(
      '[placeholder="E-mail address or pixiv ID"',
      this._config.pixiv.username
    );
    await page.type('[placeholder="Password"', this._config.pixiv.password);
    await Promise.all([
      page.click('aria/Login[role="button"]'),
      page.waitForNavigation(),
    ]);
    this._logger.log("Successfully logged into pixiv");
  }

  private async _restore(page: Page): Promise<void> {
    const cookies = await this._storage.read();
    await page.setCookie(...cookies);
  }

  private async _save(page: Page): Promise<void> {
    const cookies = await page.cookies();
    await this._storage.save(cookies);
  }
}
