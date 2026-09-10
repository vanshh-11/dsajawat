module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable TerserPlugin (minification) to avoid ajv/schema-utils conflicts
      webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.filter(
        (plugin) => plugin.constructor.name !== 'TerserPlugin'
      );
      return webpackConfig;
    },
  },
};