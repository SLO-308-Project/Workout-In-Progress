import mongoose from "mongoose";
//import machineModel from "./machine";

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
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
        units: {
            type: String,
            enum: ["lbs", "kilos"],
            default: "lbs",
        },
        sessionLogId: {
            //reference to a sessionLog.
            type: mongoose.Schema.Types.ObjectId,
            ref: "sessionLog",
            require: true,
        },
        currentSessionId: {
            //reference to a session.
            type: mongoose.Schema.Types.ObjectId,
            ref: "session",
            require: false,
        },
        machineLogId: {
            //reference to a machineLog.
            type: mongoose.Schema.Types.ObjectId,
            ref: "machineLog",
            require: true,
        },
    },
    {
        collection: "users",
    },
);

const userModel = mongoose.model("user", userSchema);
export type userType = mongoose.InferSchemaType<typeof userSchema>;
export default userModel;
