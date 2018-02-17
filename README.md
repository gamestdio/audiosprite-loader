# Webpack Audio Sprite Loader & Plugin

Audio Sprite loader for Webpack. This loader currently only supports [howler.js](https://github.com/goldfire/howler.js/) format. It should be pretty easy to support other audio libraries though.

## Dependencies

You'll need `ffmpeg` installed.

**OSX**

```
brew install ffmpeg --with-theora --with-libvorbis
```

## Usage

**`webpack.config.js`**

```javascript
const AudioSpritePlugin = require("webpack-audiosprite-plugin");

module.exports = {
    module: {
        loaders: [
            {
              test: /\.(wav|mp3)$/,
              loader: AudioSpritePlugin.loader()
            }
        ]
    },
    plugins: [
        new AudioSpritePlugin()
    ]
}
```

**`index.js`**

```javascript
const audio = require("./audio/file.wav");
audio.play();
```

## License

MIT
