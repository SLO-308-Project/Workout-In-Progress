"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userListSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        auto: true,
    },
    userId: {
        //reference to a user._id
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
    },
}, {
    collection: "userLists",
});
const userListModel = mongoose_1.default.model("userList", userListSchema);
exports.default = userListModel;
