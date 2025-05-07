"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//defines the schema for machine.
const machineSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        auto: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    muscle: {
        type: String,
        required: true,
        trim: true,
    },
    attributes: {
        default: [],
        type: [
            {
                name: {
                    type: String,
                    trim: true,
                },
                unit: {
                    type: String,
                    enum: ["lbs", "deg", "kgs", "s", "m", "reps", "cal"],
                    required: true,
                },
            },
        ],
    },
}, {
    collection: "machines",
    //_id: false, //uncomment once machine is a subdocument of user. As a primary document _id is mandetory.
});
//Schema for machine.
const machineModel = mongoose_1.default.model("machine", machineSchema);
exports.default = machineModel;
