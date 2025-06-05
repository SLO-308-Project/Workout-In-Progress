import mongoose from "mongoose";

const machineSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        name: {
            type: String,
            required: true,
            maxlength: [50, "Machine name can not exceed 50 characters"],
            match: [
                /^[a-zA-Z0-9\s_-]+$/,
                "Machine name contains invalid characters",
            ],
            trim: true,
        },
        muscle: {
            type: String,
            required: true,
            maxLength: [20, "Muscle name can not exceed 20 characters"],
            match: [
                /^[a-zA-Z\s]+$/,
                "Muscle name can only contain letters and spaces",
            ],
            trim: true,
        },
        attributes: {
            default: [],
            type: [
                {
                    name: {
                        type: String,
                        maxLength: [
                            15,
                            "Attribute name can not exceed 15 characters",
                        ],
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
    },
    {
        collection: "machines",
    },
);

const machineModel = mongoose.model("machine", machineSchema);
export type MachineType = mongoose.InferSchemaType<typeof machineSchema>;
export default machineModel;
