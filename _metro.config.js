const { getDefaultConfig } = require('expo/metro-config');

// Obtener configuración por defecto
const config = getDefaultConfig(__dirname);

// Configuración adicional para Windows
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'js', 'jsx', 'json', 'ts', 'tsx', 'mjs'],
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
  // Añadir soporte para rutas Windows
  unstable_enablePackageExports: true,
  unstable_conditionNames: ['require', 'import'],
};

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

// Configuración específica para Windows
config.server = {
  ...config.server,
  port: 8081,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url.includes('.bundle')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      // Normalizar rutas en Windows
      if (req.url.includes('C:')) {
        req.url = req.url.replace(/C:/gi, '');
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;