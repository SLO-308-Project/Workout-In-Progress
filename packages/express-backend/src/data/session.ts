import mongoose from "mongoose";

const session = new mongoose.Schema(
    {
        session: [
            {
                date: {},
                time: {},
                workout: [
                    {
                        machineId: {
                            type: mongoose.Schema.Types.ObjectId,
                        },
                        sets: [
                            {
                                reps: {},
                                weight: {},
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        collection: "sessions",
    },
);

const sessionSchema = mongoose.model("session", session);
export type sessionType = mongoose.InferSchemaType<typeof session>;
export default sessionSchema;
