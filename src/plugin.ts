import * as audiosprite from "audiosprite";
import * as fs from "fs";

export class Deferred {
    promise: Promise<any>;

    reject: Function;
    resolve: Function;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    then (func: (value: any) => any) {
        return this.promise.then(func);
    }

    catch (func: (value: any) => any) {
        return this.promise.catch(func);
    }
}

export class Plugin {
    options: any;
    files: string[] = [];

    generateTimeout: any;
    generateDeferred: Deferred;

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
            this.generateDeferred = new Deferred();
            this.generateDeferred.then((data) => {
                Plugin.onReadyCallbacks.map(callback => callback(data));
            });

            Plugin.onReadyCallbacks = [];

            compilation.plugin("normal-module-loader", (context, module) => {
                if (
                    module.loaders &&
                    module.loaders.filter(l => l.loader.indexOf("audiosprite-loader/lib/loader.js") >= 0).length > 0
                ) {
                    this.enqueueFileForGeneration(compilation, module.userRequest, 100);
                }
            });
        });
    }

    enqueueFileForGeneration (compilation, filename, accumulateInterval) {
        if (this.generateTimeout) clearTimeout(this.generateTimeout);

        this.files.push(filename);

        this.generateTimeout = setTimeout(() => {
            audiosprite(this.files, this.options, (err, result) => {
                if (err) return console.error(err)

                // read and add audio files as compilation assets
                // generated files will be removed from the filesystem
                Promise.all([
                    this.addCompilationAsset(compilation, `${this.options.output}.mp3`),
                    this.addCompilationAsset(compilation, `${this.options.output}.ogg`),
                    this.addCompilationAsset(compilation, `${this.options.output}.ac3`),
                    this.addCompilationAsset(compilation, `${this.options.output}.m4a`),

                ]).then(() => {
                    this.generateDeferred.resolve(JSON.stringify(result))
                });
            });
        }, accumulateInterval);
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
