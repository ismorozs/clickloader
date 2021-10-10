const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {

  entry: {
    'background-script': './src/background-script.js',
    'page-script': './src/page-script.js',
    'options': './src/options.js'
  },

  output: {
    path: path.resolve(__dirname, 'extension'),
    filename: (chunkData) => {
      switch (chunkData.chunk.name) {
        case 'options':
          return `./options/options.js`;

        default:
          return `./${chunkData.chunk.name}.js`;
      }
    }
  },

  mode: 'development',
  watch: true,

  stats: {
    colors: true
  },

  devtool: false,

  plugins: [
    new CopyPlugin({
      patterns: [
        createCopyPattern('icons'),
        createCopyPattern('options'),
        createCopyPattern('manifest.json'),
      ],
    }),
  ],

};

function createCopyPattern(endPoint) {
  return {
    from: path.resolve(__dirname, 'src', endPoint),
    to: path.resolve(__dirname, 'extension', endPoint),
    filter: (path) => !path.endsWith('.js'),
  };
}
