import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginJest from "eslint-plugin-jest";

export default [
    // JavaScript and TypeScript recommended rules
    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ["**/*.{ts,tsx}"],

        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                es2021: true,
                jest: true,
            },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            prettier: eslintPluginPrettier,
            jest: eslintPluginJest,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
            "react-refresh/only-export-components": [
                "warn",
                {allowConstantExport: true},
            ],
        },
    },
];
