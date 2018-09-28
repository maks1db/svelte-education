const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const fs = require('fs');
const path = require('path');

const analyzeBundle = false;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';
const isStage = process.env.TYPE === 'stage';

const checkDir = dir => !fs.existsSync(dir) && fs.mkdirSync(dir);

const build = async () => {
    // create folders
    ['public', 'public/js'].forEach(folder => checkDir(path.resolve(__dirname, folder)));

    const plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                BROWSER: JSON.stringify(true),
                DEV: isDevelopment,
                STAGE: isStage,
            },
        }),
        isDevelopment && new webpack.NamedModulesPlugin(),
        analyzeBundle && new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/template/template.tpl',
        }),
    ].filter(x => x !== false);

    const entry = ['./src/index.js'];

    return {
        entry,
        output: {
            path: path.resolve(__dirname, 'public/'),
            publicPath: '/',
            filename: 'js/bundle.js',
        },
        resolve: {
            extensions: ['.js', '.html'],
        },
        devtool: isDevelopment && 'inline-source-map',
        devServer: {
            historyApiFallback: true,
            hot: true,
        },
        optimization: {
            minimize: !isDevelopment,
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader', 'postcss-loader'],
                },
                {
                    test: /\.less$/,
                    use: [
                        'style-loader',
                        'css-loader?source-map&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                        'postcss-loader',
                        'less-loader',
                    ],
                },
                {
                    test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                    loader: 'file-loader?name=[path][name].[ext]',
                },
                {
                    test: /\.(png)?$/,
                    loader: 'file-loader?name=[path][name].[ext]',
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-inline-loader',
                },
                {
                    test: /\.html$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'svelte-loader',
                        options: {
                            skipIntroByDefault: true,
                            nestedTransitions: true,
                            emitCss: true,
                            hotReload: true,
                        },
                    },
                },
            ],
        },
        plugins,
    };
};

module.exports = build();
