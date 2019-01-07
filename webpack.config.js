const path = require('path')

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'docs1'),
    filename: '[name].js',
    publicPath: '/jervis/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              typeCheck: true,
              fix: true,
              formatter: 'codeFrame'
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      // {
      //   test: /\.(js|jsx)$/,
      //   use: 'babel-loader',
      //   exclude: /node_modules/,
      // },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 300,
              name: 'static/media/[path][name].[ext]'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: 'dist',
    port: 3000,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
