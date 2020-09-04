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
            }]
        },
        optimization: {
            minimizer: [
                new (require(`terser-webpack-plugin`))()
            ]
        }
    }, require(file), (object, source) => _.isArray(object) ? object.concat(source) : undefined)
);
