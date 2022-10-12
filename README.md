# pixiv-to-raindrop

A lambda function that executes automated mirroring of bookmarks from [Pixiv](https://pixiv.net) to [Raindrop.io](https://raindrop.io)

## Demo

- Source: https://www.pixiv.net/users/35829372/bookmarks/artworks
- Targets
  - HTML: https://raindrop.io/neet/a-24614249
  - RSS: https://bg.raindrop.io/rss/public/24614249

## Configuration

All configurations can be set via environment variables

| name                  | required | default | description                                                                                                    |
| :-------------------- | :------- | :------ | :------------------------------------------------------------------------------------------------------------- |
| `PIXIV_USERNAME`      | Yes      |         | Your Pixiv username                                                                                            |
| `PIXIV_PASSWORD`      | Yes      |         | Your Pixiv password                                                                                            |
| `RAINDROP_TOKEN`      | Yes      |         | Your Raindrop.io token. You can get it from [integrations page](https://app.raindrop.io/settings/integrations) |
| `RAINDROP_COLLECTION` | No       | `null`  | Raindrop collection to save links to                                                                           |
| `RAINDROP_TAGS`       | No       | []      | Comma-separated tags of links                                                                                  |

For further information, see `services/config/config-env.ts`.
