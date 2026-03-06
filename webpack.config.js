const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          '@nozbe/watermelondb',
          '@nozbe/with-observables',
        ],
      },
    },
    argv
  );

  // Configuración específica para WatermelonDB en web
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-sqlite-storage': 'react-native-web',
  };

  // Asegurar que los bundles tengan el MIME type correcto
  config.output = {
    ...config.output,
    filename: 'bundle.js',
  };

  // Configurar devServer
  config.devServer = {
    ...config.devServer,
    static: {
      directory: './web-build',
    },
    headers: {
      'Content-Type': 'application/javascript',
    },
    hot: true,
    liveReload: true,
  };

  return config;
};