import { inject, injectable } from "inversify";
import type { Browser, Page } from "puppeteer";

import { TYPES } from "../../../types";
import { ILogger } from "../../logger/logger";
import { ICookieStorage } from "../../storage/cookie-storage";

const LOGIN_URL = new URL("https://accounts.pixiv.net/login");

export interface LoginParameters {
  readonly username: string;
  readonly password: string;
}

@injectable()
export class LoginInterpreter {
  public constructor(
    @inject(TYPES.CookieStorage)
    private readonly _storage: ICookieStorage,

    @inject(TYPES.Logger)
    private readonly _logger: ILogger
  ) {}

  public async login(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    browser: Browser,
    parameters: LoginParameters
  ): Promise<void> {
    const page = await browser.newPage();

    try {
      await this._restore(page);

      await this._loginByPassword(
        page,
        parameters.username,
        parameters.password
      );

      await this._save(page);
    } finally {
      await page.close();
    }
  }

  private async _loginByPassword(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    page: Page,
    username: string,
    password: string
  ): Promise<void> {
    this._logger.log("Logging into pixiv...");
    await page.goto(LOGIN_URL.href);
    const currentUrl = new URL(page.url());

    if (currentUrl.href !== LOGIN_URL.href) {
      this._logger.log("Session found. Skipped...");
      return;
    }

    await page.type('[placeholder="E-mail address or pixiv ID"]', username);
    await page.type('[placeholder="Password"]', password);

    await Promise.all([
      page.click('aria/Login[role="button"]'),
      page.waitForNavigation(),
    ]);
    this._logger.log("Successfully logged into pixiv");
  }

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  private async _restore(page: Page): Promise<void> {
    const cookies = await this._storage.read();
    await page.setCookie(...cookies);
  }

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  private async _save(page: Page): Promise<void> {
    const cookies = await page.cookies();
    await this._storage.save(cookies);
  }
}
