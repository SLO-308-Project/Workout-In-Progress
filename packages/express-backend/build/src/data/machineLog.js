"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import machineModel from "./machine";
const machineLogSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        auto: true,
    },
    machineIds: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "machine",
        },
    ],
}, {
    collection: "machineLogs",
});
const machineLogModel = mongoose_1.default.model("machineLog", machineLogSchema);
exports.default = machineLogModel;
