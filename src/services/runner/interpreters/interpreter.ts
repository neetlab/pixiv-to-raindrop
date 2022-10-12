import { inject, injectable } from "inversify";
import type { Browser } from "puppeteer";

import type { Artwork } from "./artwork-interpreter";
import { ArtworkInterpreter } from "./artwork-interpreter";
import type { LoginParameters } from "./login-interpreter";
import { LoginInterpreter } from "./login-interpreter";
import { UserInterpreter } from "./user-interpreter";

export interface ConfiguredInterpreter {
  readonly login: (parameters: LoginParameters) => Promise<void>;
  readonly fetchBookmarks: (page: number) => Promise<string[] | undefined>;
  readonly fetchArtwork: (url: string) => Promise<Artwork>;
}

// Facade
@injectable()
export class Interpreter {
  public constructor(
    @inject(LoginInterpreter)
    private readonly _loginInterpreter: LoginInterpreter,

    @inject(UserInterpreter)
    private readonly _userInterpreter: UserInterpreter,

    @inject(ArtworkInterpreter)
    private readonly _artworkInterpreter: ArtworkInterpreter
  ) {}

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  public configure(browser: Browser): ConfiguredInterpreter {
    return {
      login: async (parameters: LoginParameters) =>
        this._loginInterpreter.login(browser, parameters),
      fetchBookmarks: async (page: number) =>
        this._userInterpreter.fetchBookmarks(browser, page),
      fetchArtwork: async (url: string) =>
        this._artworkInterpreter.fetchArtwork(browser, url),
    };
  }
}
