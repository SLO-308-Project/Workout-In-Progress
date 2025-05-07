"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const argon2_1 = __importDefault(require("argon2"));
// Hash passwords
function hashPassword(plainPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield argon2_1.default.hash(plainPassword);
        }
        catch (err) {
            console.error("Password hashing failed:", err);
            throw new Error("Password processing failed");
        }
    });
}
// Compare hashed password to plain password for verification
function verifyPassword(hashPassword, plainPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield argon2_1.default.verify(hashPassword, plainPassword);
        }
        catch (err) {
            console.error("Password verification failed:", err);
            throw new Error("Password verification failed");
        }
    });
}
