const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

// Configuration des extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg', 'mjs', 'cjs'];
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');

// Configuration des alias et des polyfills
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.extraNodeModules = require('node-libs-browser');

module.exports = config;