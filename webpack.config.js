// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/eventBus.ts', // Entry point of your TypeScript module
    output: {
        filename: 'eventBus.js', // Output bundle file name
        path: path.resolve(__dirname, 'dist/browser'), // Output directory
        libraryTarget: 'window',
    },
    resolve: {
        extensions: ['.ts', '.js'], // Allow imports of .ts and .js files
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
    optimization: {
        minimize: false, // Disable code minification
    },
    ignoreWarnings: [/Critical dependency: require function is used/],
};
