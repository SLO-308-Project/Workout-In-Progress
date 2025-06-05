import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        name: {
            type: String,
            required: true,
            maxLength: [20, "Username can not exceed 20 characters"],
            match: [
                /^[a-zA-Z0-9_-]+$/,
                "Username can only contain letters, numbers, underscores, and hyphens",
            ],
            trim: true,
        },
        email: {
            type: String,
            required: true,
            maxLength: [254, "Email can not exceed 254 characters"],
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is not valid"],
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            maxLength: [128, "Password can not exceed 128 characters"],
            trim: true,
            select: false,
        },
        settingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "settings",
            require: true,
        },
        sessionLogId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "sessionLog",
            require: true,
        },
        currentSessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "session",
            require: false,
        },
        machineLogId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "machineLog",
            require: true,
        },
        templateListId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "templateList",
            require: true,
        },
    },
    {
        collection: "users",
    },
);

const userModel = mongoose.model("user", userSchema);
export type UserType = mongoose.InferSchemaType<typeof userSchema>;
export default userModel;
