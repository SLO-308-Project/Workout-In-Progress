"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sessionSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        auto: true,
    },
    date: {
        type: Date, // changes to date do not persist automatically. must use doc.markModified('pathToYourDate') before saving changes.
        default: Date.now,
    },
    time: {
        type: Number, // integer in seconds. ex 5000 = 5000/3600Hrs, (5000%3600)/60Min, (5000%60)Sec.
        default: 0,
    },
    workout: [
        {
            _id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                auto: true,
            },
            machineId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "user.machines",
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
    collection: "sessions",
});
const sessionModel = mongoose_1.default.model("session", sessionSchema);
exports.default = sessionModel;
