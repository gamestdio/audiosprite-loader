# Webpack Audio Sprite Loader & Plugin

Audio Sprite loader for Webpack. This loader currently only supports [howler.js](https://github.com/goldfire/howler.js/) format. It should be pretty easy to support other audio libraries though.

- [Usage](#usage)
- [Dependencies](#dependencies)

## Usage

Install the loader.

```
npm install audiosprite-loader
```

**`webpack.config.js`**

```javascript
const AudioSprite = require("audiosprite-loader");

module.exports = {
    module: {
        loaders: [
            {
              test: /\.(wav|mp3)$/,
              loader: AudioSprite.loader()
            }
        ]
    },
    plugins: [
        new AudioSprite.Plugin()
    ]
}
```

**`index.js`**

```javascript
const audio = require("./audio/file.wav");
audio.play();
```

## Dependencies

You'll need `ffmpeg` installed.

**OSX**

```
brew install ffmpeg --with-theora --with-libvorbis
```

## License

MIT
