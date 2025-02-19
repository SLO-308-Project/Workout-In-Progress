import mongoose from "mongoose";
import machineModel from "./machine";

const userSchema = new mongoose.Schema(
    {
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
        units: {
            type: String,
            enum: ["lbs", "kilos"],
            default: "lbs",
        },
        sessionLogId: {
            //reference to a sessionLog.
            type: mongoose.Schema.Types.ObjectId,
            ref: "sessionLog",
        },
        currentSessionId: {
            //reference to a session.
            type: mongoose.Schema.Types.ObjectId,
            ref: "session",
        },
        machines: [
            //embeded list of machines.
            machineModel.schema,
        ],
    },
    {
        collection: "users",
    },
);

const userModel = mongoose.model("user", userSchema);
export type userType = mongoose.InferSchemaType<typeof userModel>;
export default userModel;
