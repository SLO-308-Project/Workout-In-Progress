// https://docs.expo.dev/guides/using-eslint/
module.exports = {
    extends: "expo",
    ignorePatterns: ["/app-example/**/"],
    settings: {
      "import/resolver": {
        typescript: {
          project: "./packages/native-frontend/tsconfig.json",
        },
      },
    },
  };
  