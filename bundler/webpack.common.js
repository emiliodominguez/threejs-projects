import { resolve } from "path";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCSSExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const { loader } = MiniCSSExtractPlugin;

export default {
	entry: {
		main: [resolve(process.env.PWD, "./src/ts/index.ts"), resolve(process.env.PWD, "./src/scss/main.scss")]
	},
	output: {
		filename: "bundle.[contenthash].js",
		path: resolve(process.env.PWD, "./dist")
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"]
	},
	stats: "errors-only",
	module: {
		rules: [
			// HTML
			{
				test: /\.(html)$/,
				use: ["html-loader"]
			},

			// Typescript
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: ["ts-loader"]
			},

			// JS
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ["babel-loader"]
			},

			// CSS
			{
				test: /\.(c|sc|sa)ss$/,
				use: [loader, "css-loader", "sass-loader"]
			},

			// Images
			{
				test: /\.(jpg|png|gif|svg)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							outputPath: "assets/images"
						}
					}
				]
			},

			// Fonts
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							outputPath: "assets/fonts"
						}
					}
				]
			}
		]
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: resolve(process.env.PWD, "./src/assets"),
					noErrorOnMissing: true
				}
			]
		}),

		new HtmlWebpackPlugin({
			template: resolve(process.env.PWD, "./src/index.html"),
			minify: true
		}),

		new MiniCSSExtractPlugin(),

		new CssMinimizerPlugin()
	]
};
