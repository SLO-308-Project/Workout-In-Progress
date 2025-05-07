"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const settingSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        auto: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        require: true,
    },
    // ui settings
    theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
    }
});
const settingModel = mongoose_1.default.model("setting", settingSchema);
exports.default = settingModel;
