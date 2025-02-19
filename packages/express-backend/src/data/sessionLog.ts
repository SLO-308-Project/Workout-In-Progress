import mongoose from "mongoose";

const sessionLogSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "session",
        },
    },
    {
        collection: "sessionLogs",
    },
);

const sessionLogModel = mongoose.model("sessionLog", sessionLogSchema);
export type sessionLogType = mongoose.InferSchemaType<typeof sessionLogModel>;
export default sessionLogModel;
