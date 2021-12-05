/* eslint-disable @typescript-eslint/no-var-requires */
"use strict"
const path = require("path")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

/** @type import('webpack').Configuration */
module.exports = (env, argv) => {
  const { mode } = argv
  /** @type import('webpack').Configuration.rules */
  const rules = [
    {
      test: /\.(j|t)sx?$/,
      use: [
        {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            experimentalWatchApi: true
          }
        }
      ]
    },
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    },
    {
      test: /\.(gif|png|jpe?g|svg|woff|woff2|eot|ttf)$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 244,
            name: "static/media/[path][name].[ext]",
            esModule: false
          }
        }
      ]
    }
  ]
  const plugins = [new ForkTsCheckerWebpackPlugin()]

  if (mode === "production") {
    rules.push({
      test: /\.tsx?$/,
      enforce: "pre",
      use: [
        {
          loader: "eslint-loader",
          options: {
            fix: true,
            formatter: "codeFrame"
          }
        }
      ],
      exclude: /node_modules/
    })
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "static"
      })
    )
  }

  return {
    mode,
    entry: "./src/index.tsx",
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            name: "vendor",
            chunks: "initial",
            enforce: true
          },
          calculator: {
            test: /kc-calculator/,
            name: "calculator",
            chunks: "initial",
            enforce: true
          },
          data: {
            test: /data/,
            name: "data",
            chunks: "initial",
            enforce: true
          }
        }
      }
    },
    output: {
      path: path.resolve(__dirname, "docs"),
      filename: "[name].js",
      publicPath: "/jervis/"
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".json"]
    },
    module: {
      rules
    },
    devServer: {
      clientLogLevel: "warning",
      contentBase: path.resolve(__dirname, "docs"),
      openPage: "jervis/",
      port: 8000,
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      }
    },
    plugins
  }
}
