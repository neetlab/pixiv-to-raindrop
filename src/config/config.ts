export interface IConfig {
  pixiv: {
    username: string;
    password: string;
  };
  raindrop: {
    token: string;
    collection: number;
    tags: string[];
  };
}
