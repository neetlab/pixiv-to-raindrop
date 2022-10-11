export namespace raindrop {
  export namespace v1 {
    export namespace _import {
      export namespace url {
        export interface exists {
          result: boolean;
          ids: number[];
          duplicates: {
            _id: number;
            link: string;
          }[];
        }
      }
    }
  }
}
