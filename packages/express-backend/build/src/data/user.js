"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//import machineModel from "./machine";
const userSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        auto: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false,
    },
    settingId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "settings",
        require: true,
    },
    sessionLogId: {
        //reference to a sessionLog.
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "sessionLog",
        require: true,
    },
    currentSessionId: {
        //reference to a session.
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "session",
        require: false,
    },
    machineLogId: {
        //reference to a machineLog.
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "machineLog",
        require: true,
    },
    templateListId: {
        //erference to a templateList
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "templateList",
        require: true,
    },
}, {
    collection: "users",
});
const userModel = mongoose_1.default.model("user", userSchema);
exports.default = userModel;
