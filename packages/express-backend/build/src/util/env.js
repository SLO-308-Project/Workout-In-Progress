"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = getEnv;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getEnv(name) {
    const value = process.env[name];
    if (!value) {
        // Check if we're running in Jest (it sets JEST_WORKER_ID)
        if (process.env.JEST_WORKER_ID) {
            return `test-${name}`;
        }
        throw new Error(`Environment variable ${name} is not set.`);
    }
    return value;
}
