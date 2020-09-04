const _ = require(`lodash`);

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
            }]
        },
        optimization: {
            minimizer: [
                new (require(`terser-webpack-plugin`))()
            ]
        }
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
