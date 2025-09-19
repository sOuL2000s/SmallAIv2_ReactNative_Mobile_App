// babel.config.js

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // THIS IS IMPORTANT FOR REANIMATED
      // We will explicitly add the react-native-voice plugin here if it still fails
    ],
  };
};