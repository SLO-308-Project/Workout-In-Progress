/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: "node",

    transform: {"^.+.tsx?$": ["ts-jest", {}]},
    testTimeout: 20000,
};
