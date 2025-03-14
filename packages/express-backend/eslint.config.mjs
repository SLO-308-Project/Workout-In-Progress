import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config({
    files: ["**/*.ts"],
    ignores: ["**/coverage/**"],
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
        parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
        },
    },
    plugins: {
        "@stylistic": stylistic,
    },
    rules: {
        "@stylistic/semi": "error",
        "eslint-comments/no-unused-disable": "off",
        "@typescript-eslint/no-unsafe-assignment": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {argsIgnorePattern: "^_"},
        ],
    },
});
