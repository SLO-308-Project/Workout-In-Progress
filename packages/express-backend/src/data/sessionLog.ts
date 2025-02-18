import mongoose from "mongoose";

const sessionLog = new mongoose.Schema(
    {
        sessions: [
            {
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
    },
    {
        collection: "sessionLogs",
    },
);

const sessionLogSchema = mongoose.model("sessionLog", sessionLog);
export type sessionLogType = mongoose.InferSchemaType<typeof sessionLog>;
export default sessionLogSchema;
