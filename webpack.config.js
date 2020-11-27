module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: 'raw-loader'
            }
        ]
    }
}