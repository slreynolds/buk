const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'source-map',

  entry: [
    // entry to react
    path.resolve(__dirname, 'src/index.js')
  ],

  output: {
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // where to build the package
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [{
        test: /\.js$/,
        use: [ 'source-map-loader' ],
        include: path.resolve(__dirname, 'src'),
        enforce: 'pre',
      },{
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },

  devServer: {
      host: '0.0.0.0',
      port: process.env.PORT || 3000,
      // where to get the index.html from
      contentBase: path.resolve(__dirname, 'public'),
      watchOptions: {
        poll: 500
      }
    },
};
