import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true,
    },

    // ui settings
    theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
    },
});

const settingModel = mongoose.model("setting", settingSchema);
export type SettingType = mongoose.InferSchemaType<typeof settingSchema>;
export default settingModel;
