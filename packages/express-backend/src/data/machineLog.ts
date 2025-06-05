import mongoose from "mongoose";

const machineLogSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        machineIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "machine",
            },
        ],
    },
    {
        collection: "machineLogs",
    },
);

const machineLogModel = mongoose.model("machineLog", machineLogSchema);
export type MachineLogType = mongoose.InferSchemaType<typeof machineLogSchema>;
export default machineLogModel;
