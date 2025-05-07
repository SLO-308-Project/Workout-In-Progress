"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import machineModel from "./machine";
const templateListSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        auto: true,
    },
    templateIds: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "sessionTemplate",
        },
    ],
}, {
    collection: "templateLists",
});
const templateListModel = mongoose_1.default.model("templateList", templateListSchema);
exports.default = templateListModel;
