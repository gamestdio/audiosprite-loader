import * as path from "path";

import { Plugin } from "./plugin"

module.exports = function (content: Buffer, map: any, meta: any) {
    const callback = this.async();
    const soundId = path.basename(this.resourcePath, path.extname(this.resourcePath))

    Plugin.FILES[ this.resourcePath ] = true;

    Plugin.onReady((data) => {
        const str = `
const Howl = require("howler").Howl;

window.$_audiosprite = window.$_audiosprite || new Howl(${data});

module.exports = {
  play: function () {
    window.$_audiosprite.play("${ soundId }");
  }
}`;

        callback(null, str);
    })

}

module.exports.raw = true;
