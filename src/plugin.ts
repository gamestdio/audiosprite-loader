import * as audiosprite from "audiosprite";
import * as fs from "fs";

export class Plugin {
    options: any;

    static FILES = {};
    static onReadyCallbacks = [];

    static onReady (callback) {
        this.onReadyCallbacks.push(callback);
    }

    constructor (options: any = {}) {
        if (!options.format) {
            options.format = "howler2";
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

                    const data = JSON.stringify(result);
                    Plugin.onReadyCallbacks.map(callback => callback(data));

                    // read and add audio files as compilation assets
                    // generated files will be removed from the filesystem
                    Promise.all([
                        this.addCompilationAsset(compilation, `${this.options.output}.ac3`),
                        this.addCompilationAsset(compilation, `${this.options.output}.m4a`),
                        this.addCompilationAsset(compilation, `${this.options.output}.mp3`),
                        this.addCompilationAsset(compilation, `${this.options.output}.ogg`)
                    ]).then(() => next());
                });

            } else {
                next();
            }
        });
    }

    addCompilationAsset (compilation, filename: string) {
        return new Promise((resolve, reject) => {
            fs.readFile(filename, (err, buffer) => {
                if (err) console.error(err);

                compilation.assets[filename] = {
                    source: () => buffer,
                    size: () => buffer.length
                };

                fs.unlink(filename, (err) => { if (err) console.log(err) });

                resolve();
            });
        });
    }

    isHotUpdateCompilation (assets) {
        return assets.js.length && assets.js.every(name => {
            return /\.hot-update\.js$/.test(name);
        });
    }

}
