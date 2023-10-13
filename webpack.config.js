// webpack.config.js
const path = require('path');
// const CompressionPlugin = require('compression-webpack-plugin');
/**
 * Generates a Webpack configuration for a given library name and target.
 *
 * @param {string} libraryName - The name of the library.
 * @param {string} libraryTarget - The library target format.
 * @returns {Object} - The Webpack configuration.
 */
const getWebpackConfig = (libraryName, libraryTarget, dir, ext) => ({
    entry: `./src/${libraryName}.${ext}`,
    resolve: {
        modules: ['node_modules', path.resolve(__dirname, 'src')],
        extensions: ['.mjs', '.js', '.json', '.cjs', '.ts'],
    },
    output: {
        path: path.resolve(__dirname, `dist/${dir}`),
        filename: `${libraryName}.js`,
        library: libraryName,
        libraryTarget: libraryTarget,
        umdNamedDefine: true,
    },
    stats: 'errors-only',
    optimization: {
        minimize: false, // Disable code minification
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // Match .ts files
                use: 'ts-loader', // Use ts-loader for .ts files
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        // new CompressionPlugin({
        //     algorithm: 'brotliCompress',
        //     test: /\.js$/,
        //     compressionOptions: { level: 11 },
        //     threshold: 10240,
        //     minRatio: 0.8,
        //     deleteOriginalAssets: false,
        // }),
    ],
    ignoreWarnings: [/Critical dependency: require function is used/],
});

const targets = [{ name: 'eventBus', ext: 'ts' }];

// Generate multiple configurations
const configs = targets.flatMap((target) => [
    getWebpackConfig(target.name, 'umd', 'umd', target.ext),
    getWebpackConfig(target.name, 'commonjs2', 'cjs', target.ext),
    getWebpackConfig(target.name, 'window', 'browser', target.ext),
]);

module.exports = configs;
