const webpack = require('webpack');
const { config, common, nodeConfig } = require('./webpack.config.js');
const open = require('opn');

if (config.mode === common.modes.dev) {
    const express = require('express');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const WebpackHotMiddleware = require('webpack-hot-middleware');
    const fallback = require('connect-history-api-fallback');
    const app = express();
    const compiler = webpack(config);
    compiler.apply(new webpack.ProgressPlugin());

    // app.use('public', express.static('dist'));
    app.use(fallback({
        // index: '/app.html',
        rewrites: common.entries.map(item => {
            let from = eval('/^\\/' + item.name + '(\\/|$)/');
            let to = '/' + (typeof item.filename === 'object' ? item.filename[config.mode] : item.filename);
            return { from, to };
        })
    }));
    // Tell express to use the webpack-dev-middleware and use the webpack.config.js
    // configuration file as a base.
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: 'errors-only'
    }));
    app.use(WebpackHotMiddleware(compiler));
    if (nodeConfig.proxy) {
        const config = require(common.proxy);
        const proxy = require('http-proxy-middleware');
        config.forEach(item => app.use(proxy(item.context, item.opts)));
    } else if (nodeConfig.mock) {
        const proxyMiddleware = require('./mock.middleware');
        proxyMiddleware(app, common.mock);
    }
    app.listen(common.port, () => {
        open(`http://localhost:${common.port}/admin`);
    });
} else {
    webpack(config, (e, stats) => {
        // show build info to console
        console.log(stats.toString({ chunks: false, color: true }));
        // save build info to file
        // fs.writeFile(path.join(common.distPath, '__build_info.log'), stats.toString({color: false}));
    });
}