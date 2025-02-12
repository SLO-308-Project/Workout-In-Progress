import mongoose from "mongoose";

const machineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        muscle: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        collection: "machines",
        versionKey: false,
        autoIndex: true
    },
);

const machine = mongoose.model("machine", machineSchema);

export default machine;
