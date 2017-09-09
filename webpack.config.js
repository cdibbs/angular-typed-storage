module.exports = {
    entry: './dist/index.js',
    output: {
        filename: './dist/modules/typed-storage.es5.js',
        sourceMapFilename: './dist/modules/typed-storage.es5.js.map'
    },
    resolve: {
        extensions: ['.js']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    configFileName: 'tsconfig.json'
                }
            }
        ]
    }
};