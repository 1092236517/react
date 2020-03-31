const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const common = require(path.resolve(__dirname, 'common.config'));

const nodeConfig = process.argv.splice(2).reduce((pre, cur) => {
    let arg = cur.split('=');
    arg.length && (pre[arg[0]] = arg[1] || true);
    return pre;
}, {});

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackConfig = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const rootPath = path.resolve(__dirname, '..');
const srcPath = path.join(rootPath, 'src');
const distPath = path.join(rootPath, 'dist');

const { entries, modes } = common;
const isDev = nodeConfig.env === modes.dev;
const mode = isDev ? modes.dev : modes.prod;

console.log(chalk.blue('webpack entries:'));
entries.forEach(item => console.log('  ' + chalk.bgBlue.black(` ${item.name} `), `${typeof item.title === 'object' ? item.title[mode] : item.title} ${item.template ? path.join(srcPath, item.entry) : ''}`));

let webpackEntry = entries.reduce((pre, cur) => {
    if (isDev) {
        pre[cur.name] = ['webpack-hot-middleware/client?quiet=true&reload=true', path.join(srcPath, cur.entry)];
    } else {
        pre[cur.name] = [path.join(srcPath, cur.entry)];
    }
    return pre;
}, {});

const config = {
    mode,
    node: {
        __filename: true,
        fs: 'empty'
    },
    entry: webpackEntry,
    resolve: {
        extensions: [
            '.js', '.jsx'
        ],
        alias: {
            '@ant-design/icons/lib/dist$': path.resolve(__dirname, '../src/admin/utils/icon.js')
        }
    },
    resolveLoader: {
        modules: ['src', 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                include: srcPath,
                loader: 'happypack/loader?id=happyBabel'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?importLoaders=1',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?importLoaders=1',
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            sourceMap: true,
                            modifyVars: common.antdCover
                        }
                    }
                ]
            },
            { test: /\.(png|svg|jpe?g|gif)$/, use: ['file-loader'] },
            { test: /\.(woff|woff2|eot|ttf|otf)$/, use: ['file-loader'] },
            { test: /\.(csv|tsv)$/, use: ['csv-loader'] },
            { test: /\.(xml|xlsx)$/, use: ['file-loader?name=[name].[ext]'] }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Don't use hash in development, we need the persistent for "renderHtml.js"
            filename: isDev ? '[name].css' : '[name].[chunkhash:8].css',
            chunkFilename: isDev ? '[name].chunk.css' : '[name].[chunkhash:8].chunk.css'
        }),
        new webpackConfig.DefinePlugin({
            __ALIYUN_ENV__: JSON.stringify(nodeConfig.aliyun_env)
        }),
        new FilterWarningsPlugin({
            exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
        }),
        new HappyPack({
            id: 'happyBabel',
            loaders: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: isDev,
                    plugins: [
                        ["import", [
                            { libraryName: "antd", style: true }
                        ]]
                    ]
                }
            }],
            threadPool: happyThreadPool,
            verbose: true
        })
    ]
};
entries.forEach(item => {
    const entryPath = path.join(srcPath, item.name);
    config.resolve.alias[item.name.toUpperCase()] = entryPath;
    for (let child of fs.readdirSync(entryPath)) {
        let childPath = `${entryPath}/${child}`;
        let info = fs.statSync(childPath);
        info.isDirectory() && (config.resolve.alias[`${item.name}_${child}`.toUpperCase()] = childPath);
    }
}
);

if (isDev) {
    config.output = {
        filename: '[name].[hash:6].js',
        chunkFilename: '[name].[hash:6].chunk.js',
        publicPath: '/'
    };
    config.devtool = 'source-map';
    config.module.rules
        .push({
            test: /\.(js|jsx)$/,
            enforce: 'pre',
            exclude: /(node_modules|bower_components|\.spec\.js)/,
            use: [
                {
                    loader: 'eslint-loader',
                    options: {
                        failOnWarning: false,
                        failOnError: true
                    }
                }
            ]
        });
    config.plugins.push(
        new webpackConfig.HotModuleReplacementPlugin(),
        new webpackConfig.NoEmitOnErrorsPlugin()
    );
    config.plugins.push(...entries.map(item => new HtmlWebpackPlugin({
        favicon: path.join(srcPath, item.favicon),
        template: path.join(srcPath, item.template),
        chunks: [item.name],
        filename: typeof item.filename === 'object' ? item.filename[mode] : item.filename,
        title: typeof item.title === 'object' ? item.title[mode] : item.title,
        chunksSortMode: 'none'
    })));
} else {
    config.output = {
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:8].chunk.js',
        path: path.join(distPath, 'static'),
        publicPath: "/static/"
    };

    //  只在线上去掉console
    /*
    if (nodeConfig.aliyun_env == 'production') {
        config.module.rules[0].use.options.plugins.push([
            "transform-remove-console", {
                "exclude": ["error", "warn"]
            }
        ]);
    }
    */

    config.optimization = {
        minimize: true,
        splitChunks: {
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        },
        runtimeChunk: {
            name: "manifest"
        }
    };
    config.plugins.push(
        // new WebpackBundleAnalyzer.BundleAnalyzerPlugin(),
        new CleanWebpackPlugin('dist', { root: rootPath, verbose: false })
    );
    config.plugins.push(
        new webpackConfig.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
    );
    config.plugins.push(...entries.map(item => new HtmlWebpackPlugin({
        title: typeof item.title === 'object' ? item.title[mode] : item.title,
        filename: typeof item.filename === 'object' ? item.filename[mode] : item.filename,
        template: path.join(srcPath, item.template),
        chunks: [item.name, 'vendors', 'manifest'],
        chunksSortMode: "none",
        favicon: path.join(srcPath, item.favicon),
        minify: {
            caseSensitive: true,
            collapseWhitespace: true,
            removeComments: true
        }
    })));
}

module.exports.config = config;
module.exports.common = common;
module.exports.nodeConfig = nodeConfig;