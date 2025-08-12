* An entry itself is a module and when webpack encounters one, it tries to match the module against the file system using the resolve configuration. For example, you can tell webpack to perform the lookup against specific directories in addition to node_modules
  
* Each loader applies a specific transformation against the module contents.
  
* webpack tries to match the module against the file system using resolve configuration, if resolve fails webpack thorws a runtime error.
* Loaders have resolve configurations of their own
* Webpack uses enhanced-resolve package  underneath for resolving modules
* Webpack assumes all code as JavaScript by default.
* entry can be a function and even an asynchronous one 
* webpack-cli comes with additional functionality, including init and migrate
* mini-html-webpack-plugin can be used to create a index.html to output automatically, this gives basic usage for any advanced usage use html-webpack-plugin
* In addition to a configuration object, webpack accepts an array of configurations. You can also return a Promise that eventually resolves to a configuration. Latter is useful if you are fetching configuration related data from a third-party source
* webpack --watch allows recompling of source files but does nothing on th front end site and browser updates
* webpack-dev-server is the officially maintained dev server running **in-memory** (write to RAM instead of files)
* `devServer.historyApiFallback` should be set if you rely on HTML5 History API based routing
* `devServer.contentBase` - Assuming you don't generate index.html dynamically and prefer to maintain it yourself in a specific directory, you need to point WDS to it
* `devServer.proxy` - If you are using multiple servers, you have to proxy WDS to them
* `devServer.headers` - Attach custom headers to your requests here
* `webpack-plugin-serve` (WPS) is a third-party plugin that wraps the logic required to update the browser into a webpack plugin
* To integrate with another server, it's possible to emit files from WDS to the file system by setting `devServer.writeToDisk` property to true
* `webpack-plugin-serve` wraps the logic required to update the browser insto a webpack plugin.
## Notes from wbepack.js.org

* Out of the box, webpack only understands JavaScript and JSON files. Loaders allow webpack to process other types of files and convert them into valid modules that can be consumed by your application and added to the dependency graph
* While loaders are used to transform certain types of modules, plugins can be leveraged to perform a wider range of tasks like bundle optimization, asset management and injection of environment variables
* Since you can use a plugin multiple times in a configuration for different purposes, you need to create an instance of it by calling it with the new operator.
* `Usage: entry: string | [string]`
```js module.exports = {
  output: {
    filename: '[name].[contenthash].bundle.js',
  },
};
```
* use the splitChunks option to create separate chunk for vendor files, do not use entry for vendors that is not the starting point of execution
* As a rule of thumb: Use exactly one entry point for each HTML document. See the issue described here for more details.
```js
  module.exports = {
  entry: {
    app: './src/app.js',
    search: './src/search.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
};
    // writes to disk: ./dist/app.js, ./dist/search.js
```

* Loaders are evaluated/executed from right to left (or from bottom to top).
* The application shell defines commonly used libraries as shared modules to avoid duplication of them in the page builds
* Custom parameters can be passed to webpack by adding two dashes between the npm run build command and your parameters, e.g. `npm run build -- --color`.
* The `optimization.splitChunks.minSize` option can be used to change the size threshold for creating a chunk, which defaults to 30k.
* `runtimeChunk: "single"` is required to ensure correct module instantiation, it is disabled by default,
* webpack-dev-server doesn't write any output files after compiling. Instead, it keeps bundle files in memory and serves them as if they were real files mounted at the server's root path. If your page expects to find the bundle files on a different path, you can change this with the devMiddleware.publicPath option in the dev server's configuration
* webpack-dev-middleware is a wrapper that will emit files processed by webpack to a server
* Prevent Duplication: Use Entry dependencies or SplitChunksPlugin to dedupe and split chunks.
* It is possible to provide a dynamic expression to import() when you might need to import specific module based on a computed variable later.
* **prefetch:** resource is probably needed for some navigation in the future
* **preload:** resource will also be needed during the current navigation
```js
import(/* webpackPrefetch: true */ './path/to/LoginModal.js');
```
* This will result in `<link rel="prefetch" href="login-modal-chunk.js">` being appended in the head of the page, which will instruct the browser to prefetch in idle time the login-modal-chunk.js file.
* webpack will add the prefetch hint once the parent chunk has been loaded.
* Preload directive has a bunch of differences compared to prefetch:
   * A preloaded chunk starts loading in parallel to the parent chunk. A prefetched chunk starts after the parent chunk finishes loading.
  * A preloaded chunk has medium priority and is instantly downloaded. A prefetched chunk is downloaded while the browser is idle.
  * A preloaded chunk should be instantly requested by the parent chunk. A prefetched chunk can be used anytime in the future.
  * Browser support is different.
* To prevent such problem you can add your own onerror handler, which removes the script in case of any error:
```js
<script
  src="https://example.com/dist/dynamicComponent.js"
  async
  onerror="this.remove()"
></script>
```
## Build performance

* Typically, `module.exports` points to the configuration object. To use the env variable, you must convert `module.exports` to a function
* Apply loaders to the minimal number of modules necessary, Use the `include` field to only apply the loader modules that actually need to be transformed by it
* Use the DllPlugin to move code that is changed less often into a separate compilation. This will improve the application's compilation speed, although it does increase complexity of the build process
* With many watched files, this can cause a lot of CPU load. In these cases, you can increase the polling interval with watchOptions.poll
* Be aware of the performance differences between the different devtool settings.
* "eval" has the best performance, but doesn't assist you for transpiled code.
* The cheap-source-map variants are more performant if you can live with the slightly worse mapping quality.
* Use a eval-source-map variant for incremental builds.
* In most cases, eval-cheap-module-source-map is the best option.
* The Content-Security-Policy (CSP) HTTP header is used to define a set of content restrictions for a web page, particularly to mitigate the risk of cross-site scripting (XSS) attacks. The http-equiv attribute can be used to set a Content-Security-Policy in the <meta> tag for individual web pages.
```js
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com;">
```
## HMR
* Since webpack-dev-server v4.0.0, Hot Module Replacement is enabled by default.
## Tree Shaking
* A "side effect" is defined as code that performs a special behavior when imported, other than exposing one or more exports. An example of this are polyfills, which affect the global scope and usually do not provide an export.
* The `sideEffects` and `usedExports` (more known as tree shaking) optimizations are two different things.
* `sideEffects` is much more effective since it allows to skip whole modules/files and the complete subtree
* But we can help terser by using the /*#__PURE__*/ annotation. It flags a statement as side effect free. So a small change would make it possible to tree-shake the code:
```js
var Button$1 = /*#__PURE__*/ withAppProvider()(Button);
```
* TerserPlugin is used to idfentify dead code for tree shaking
* `ModuleConcatenationPlugin` is needed for the tree shaking to work. It is added by mode: 'production'. If you are not using it, remember to add the ModuleConcatenationPlugin manually.


-------New Notes -------
* To access your development server from the network, you need to figure out the IP address of your machine. For example, using ifconfig | grep inet on Unix, or ipconfig on Windows. Then you need to set your HOST to match your IP like this: HOST=<ip goes here> npm start.
* `js  HOST=172.16.6.75 npm start` 
* 