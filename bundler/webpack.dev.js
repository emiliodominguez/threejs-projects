import { merge } from "webpack-merge";
import { resolve } from "path";
import { getPort } from "portfinder-sync";
import ProgressBarPlugin from "progress-bar-webpack-plugin";
import commonConfiguration from "./webpack.common.js";

export default merge(commonConfiguration, {
	// Mode
	mode: "development",

	// Dev tools
	devtool: "source-map",

	// Dev server
	devServer: {
		port: getPort(3000),
		open: true,
		https: false,
		hot: true,
		client: {
			webSocketURL: { hostname: "0.0.0.0" },
			logging: "info",
			overlay: true,
			progress: true
		},
		static: {
			directory: resolve(process.env.PWD, "./dist"),
			watch: true
		}
	},

	// Plugins
	plugins: [new ProgressBarPlugin()]
});
