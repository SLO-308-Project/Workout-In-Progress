import mongoose from "mongoose";
// import machineModel from "./machine";

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
export type machineLogType = mongoose.InferSchemaType<typeof machineLogSchema>;
export default machineLogModel;
