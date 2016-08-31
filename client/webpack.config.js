var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

var config = {
    entry: path.resolve(__dirname, 'index.js'),
    output: getOutput(),
    devtool: process.env.NODE_ENV === 'production' ? false : "eval",
    module: {
        loaders: [
            {
                test: /\.scss$/,
                include: /src/,
                loaders: [
                    'style',
                    'css',
                    'autoprefixer?browsers=last 3 versions',
                    'sass?outputStyle=expanded'
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'url?limit=8192',
                    'img'
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: (node_modules_dir),
                loaders: [
                    'react-hot',
                    'babel?presets[]=stage-0,presets[]=react,presets[]=es2015'
                ]
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    }

};

module.exports = config;

function getOutput() {
    if (process.env.NODE_ENV === 'production') {
        return {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js'
        }
    } else {
        return {
            publicPath: 'http://localhost:8080/',
            filename: 'dist/bundle.js'
        }
    }
}
