"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import machineModel from "./machine";
const sessionTemplateSchema = new mongoose_1.default.Schema({
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
    workout: [
        {
            _id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                auto: true,
            },
            machineId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "machine",
                required: true,
            },
            sets: [
                {
                    _id: {
                        type: mongoose_1.default.Schema.Types.ObjectId,
                        auto: true,
                    },
                    attributeValues: [
                        {
                            name: String,
                            value: Number,
                        },
                    ],
                },
            ],
        },
    ],
}, {
    collection: "sessionTemplates",
});
const sessionTemplateModel = mongoose_1.default.model("sessionTemplate", sessionTemplateSchema);
exports.default = sessionTemplateModel;
