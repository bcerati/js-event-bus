const terser = require('terser');
const fs = require('fs').promises;

const filesToMinify = [
    {
        input: 'dist/module/eventBus.js',
        output: 'dist/module/eventBus.min.js',
        options: {
            compress: true,
            mangle: true,
        },
    },
    {
        input: 'dist/browser/eventBus.js',
        output: 'dist/browser/eventBus.min.js',
        options: {
            compress: true,
            mangle: true,
        },
    },
];

async function minifyFile(input, output, options) {
    try {
        const inputCode = await fs.readFile(input, 'utf8');
        const result = await terser.minify(inputCode, options);
        if (result.error) {
            console.error(`Error minifying ${input}: ${result.error}`);
            return;
        }
        await fs.writeFile(output, result.code, 'utf8');
        console.log(`Minified ${input} to ${output}`);
    } catch (err) {
        console.error(`Failed to minify ${input}: ${err}`);
    }
}

async function main() {
    for (const { input, output, options } of filesToMinify) {
        await minifyFile(input, output, options);
    }
}

main().catch((err) => {
    console.error('Minification failed:', err);
});
