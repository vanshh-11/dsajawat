const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable TerserPlugin (minification) to avoid ajv/schema-utils conflicts
      webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.filter(
        (plugin) => !(plugin instanceof TerserPlugin)
      );
      return webpackConfig;
    },
  },
};