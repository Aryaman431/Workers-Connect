// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      // Reanimated shared values (scale.value = withSpring(...)) are mutable by design;
      // the React Compiler immutability rule false-positives on them.
      'react-hooks/immutability': 'off',
    },
  },
  {
    ignores: ["dist/*"],
  }
]);
