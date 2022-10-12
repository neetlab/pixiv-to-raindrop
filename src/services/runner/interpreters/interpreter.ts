import { inject, injectable } from "inversify";
import { Browser } from "puppeteer";
import { Artwork, ArtworkInterpreter } from "./artwork-interpreter";
import { LoginInterpreter, LoginParameters } from "./login-interpreter";
import { UserInterpreter } from "./user-interpreter";

export interface ConfiguredInterpreter {
  login(parameters: LoginParameters): Promise<void>;
  fetchBookmarks(page: number): Promise<string[] | undefined>;
  fetchArtwork(url: string): Promise<Artwork>;
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

  public configure(browser: Browser): ConfiguredInterpreter {
    return {
      login: (parameters: LoginParameters) =>
        this._loginInterpreter.login(browser, parameters),
      fetchBookmarks: (page: number) =>
        this._userInterpreter.fetchBookmarks(browser, page),
      fetchArtwork: (url: string) =>
        this._artworkInterpreter.fetchArtwork(browser, url),
    };
  }
}
