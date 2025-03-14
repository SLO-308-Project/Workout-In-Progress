import mongoose from "mongoose";

const sessionLogSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        sessionIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "session",
            },
        ],
    },
    {
        collection: "sessionLogs",
    },
);

const sessionLogModel = mongoose.model("sessionLog", sessionLogSchema);
export type SessionLogType = mongoose.InferSchemaType<typeof sessionLogSchema>;
export default sessionLogModel;
