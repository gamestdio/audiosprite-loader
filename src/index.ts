export { Plugin } from "./plugin";

export function loader (options: any) {
    return require.resolve("./loader") + (options ? "?" + JSON.stringify(options) : "");
}
