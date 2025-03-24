const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const sourceExts = require('metro-config/src/defaults/defaults').sourceExts;
const assetExts = require('metro-config/src/defaults/defaults').assetExts;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
      getTransformOptions: async () => {
        return {
          transform: {
            experimentalImportSupport: false,
            inlineRequires: true,
          },
        };
      },
    },
    resolver: {
      assetExts: assetExts.filter((ext) => { return ext !== 'svg'; }),
      sourceExts: [...sourceExts, 'svg'],
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
