const _ = require(`lodash`), MiniCssExtractPlugin = require(`mini-css-extract-plugin`);

module.exports = require(`glob`).sync(`${__dirname}/src/**/webpack.config.js`).map(file =>
    _.mergeWith({
        output: {
            filename: `[name].js`,
            publicPath: `https://${process.env.VERCEL_URL}/`,
            path: `${__dirname}/public`,
            libraryTarget: `system`
        },
        module: {
            rules: [{
                parser: {
                    system: false
                }
            }, {
                exclude: /node_modules/,
                test: /\.ts$/,
                use: {
                    loader: `ts-loader`
                }
            }, {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, `css-loader`, {
                        loader: `postcss-loader`,
                        options: {
                            plugins: [
                                require(`autoprefixer`),
                                require(`cssnano`)({
                                    preset: `default`
                                })
                            ]
                        }
                    }
                ]
            }, {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader, {
                        loader: `css-loader`,
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: `[hash:base64:5]`
                            }
                        }
                    }, {
                        loader: `postcss-loader`,
                        options: {
                            plugins: [
                                require(`tailwindcss`),
                                require(`postcss-nested`),
                                require(`autoprefixer`),
                                require(`cssnano`)({
                                    preset: `default`
                                })
                            ]
                        }
                    }
                ]
            }]
        },
        optimization: {
            minimizer: [
                new (require(`terser-webpack-plugin`))()
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: `[name].css`
            })
        ]
    }, require(file), (object, source) => _.isArray(object) ? object.concat(source) : undefined)
).concat({
    entry: require(`glob`).sync(`${__dirname}/src/**/demo.js`).reduce((entries, entry) => {
        entries[entry.match(/\/src\/([a-z\-]+)\/demo.js/)[1]] = entry;
        return entries;
    }, {}),
    output: {
        filename: `[name].js`,
        publicPath: `https://${process.env.VERCEL_URL}/`,
        path: `${__dirname}/public/demo`
    },
    module: {
        rules: [{
            parser: {
                system: false
            }
        }]
    },
    optimization: {
        minimizer: [
            new (require(`terser-webpack-plugin`))()
        ]
    }
});
