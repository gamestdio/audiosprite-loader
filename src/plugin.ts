import * as audiosprite from "audiosprite";

export class Plugin {
    options: any;

    static FILES = {};
    static onReadyCallbacks = [];

    static onReady (callback) {
        this.onReadyCallbacks.push(callback);
    }

    constructor (options: any = {}) {
        if (!options.format) {
            options.format = "howler";
        }

        if (!options.output) {
            options.output = "audiosprite";
        }

        this.options = options;
    }

    apply (compiler) {
        // Setup callback for accessing a compilation:
        compiler.plugin("compilation", (compilation) => {
            Plugin.FILES = {}
            Plugin.onReadyCallbacks = [];
        });

        let compiled = false;
        compiler.plugin("after-compile", (compilation, next) => {
            if (!compiled) {
                compiled = true;

                audiosprite(Object.keys(Plugin.FILES), this.options, (err, result) => {
                    if (err) return console.error(err)

                    // howler 2.x
                    let json: any = result;
                    json.src = json.urls;

                    const data = JSON.stringify(json);

                    Plugin.onReadyCallbacks.map(callback => callback(data));

                    next();
                });

            } else {
                next();
            }
        });

       // compiler.plugin("emit", (compilation, callback) => {
       //     callback();
       // });

        compiler.plugin('done', () => {
            // console.log('Plugin: done');
        });
    }

    isHotUpdateCompilation (assets) {
        return assets.js.length && assets.js.every(name => {
            return /\.hot-update\.js$/.test(name);
        });
    };


}
