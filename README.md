# pixiv-to-raindrop

A lambda function that automatically mirrors bookmarks from [Pixiv](https://pixiv.net) to [Raindrop.io](https://raindrop.io)

## Usage

```
curl -g <URL>
```

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
