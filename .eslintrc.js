module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: "babel-eslint",
  },
  extends: [
    "@nuxtjs",
    "prettier",
    "prettier/vue",
    "plugin:prettier/recommended",
    "plugin:nuxt/recommended",
  ],
  plugins: ["prettier"],
  // add your custom rules here
  rules: {
    "no-console": 0,
    "vue/require-default-prop": 0,
    "vue/no-unused-vars": 0,
    "vue/require-prop-types": 0,
    "vue/no-v-html": 0,
    "no-cjs-in-config": 0,
  },
};
