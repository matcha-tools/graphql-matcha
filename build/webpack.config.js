const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const root = require("./helpers").root;
const VERSION = JSON.stringify(require("../package.json").version);

module.exports = function(_, { mode }) {
  return {
    performance: {
      hints: false
    },
    resolve: {
      extensions: [".ts", ".tsx", ".mjs", ".js", ".json", ".css", ".svg"]
    },
    entry: ["./src/visualizer/polyfills.ts", "./src/index.js"],
    devServer: {
      contentBase: root("demo"),
      watchContentBase: true,
      port: 9090,
      stats: "errors-only"
    },
    output: {
      path: root("demo-dist"),
      filename: "[name].js",
      sourceMapFilename: "[name].[id].map"
    },
    module: {
      rules: [
        {
          test: /\.(js|js\.flow)$/,
          use: {
            loader: "babel-loader",
            options: {
              plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-transform-arrow-functions",
                "@babel/plugin-transform-destructuring",
                "@babel/plugin-transform-regenerator",
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-syntax-async-generators"
              ],
              presets:["@babel/preset-react", "@babel/preset-flow","@babel/preset-env"]
            }
          },
        exclude: [/\.render.\js$/, /node_modules\/(?!graphql-language-service-interface\/dist).*/],

        },

        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: [/\.(spec|e2e)\.ts$/]
        },

        {
          test: /\.render\.js$/,
          use: {
            loader: "file-loader",
            options: {
              name: "voyager.worker.js"
            }
          }
        },

        {
          test: /src\/visualizer\/.*\.css$/,
          exclude: /variables\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                options: {
                  sourceMap: true
                }
              },
              "postcss-loader"
            ]
          })
        },
        {
          test: /css\/.*\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: {
              loader:"postcss-loader"
            }
          })
        }
        ,
        {
          test: /src\/visualizer\/components\/variables\.css$/,
          loader: "postcss-variables-loader?es5=1"
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                plugins: [
                  "@babel/plugin-transform-block-scoping",
                  "@babel/plugin-transform-arrow-functions",
                  "@babel/plugin-transform-destructuring"
                ]
              }
            },
            {
              loader: "react-svg-loader",
              options: {
                jsx: false,
                svgo: {
                  plugins: [{ mergePaths: false }]
                }
              }
            }
          ]
        }
      ]
    },

    plugins: [
      new webpack.LoaderOptionsPlugin({
        worker: {
          output: {
            filename: "[name].worker.js"
          }
        }
      }),

      new webpack.DefinePlugin({
        VERSION: VERSION
      }),

      new HtmlWebpackPlugin({
        template: "./index.html"
      }),

      new ExtractTextPlugin({
        filename: "[name].[hash].css"
      }),

      new CopyWebpackPlugin([
        { from: "**/*.png", context: "./demo" },
        { from: "**/*.ico", context: "./demo" }
      ])
    ]
  };
};
