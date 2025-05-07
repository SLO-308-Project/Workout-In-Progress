"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sessionLogSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        auto: true,
    },
    sessionIds: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "session",
        },
    ],
}, {
    collection: "sessionLogs",
});
const sessionLogModel = mongoose_1.default.model("sessionLog", sessionLogSchema);
exports.default = sessionLogModel;
