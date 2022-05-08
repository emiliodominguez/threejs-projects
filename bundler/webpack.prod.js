import { merge } from "webpack-merge";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import commonConfiguration from "./webpack.common.js";

export default merge(commonConfiguration, {
	// Mode
	mode: "production",

	// Plugins
	plugins: [new CleanWebpackPlugin()]
});
