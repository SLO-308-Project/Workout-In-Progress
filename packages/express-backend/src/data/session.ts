import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        date: {
            type: Date, // changes to date do not persist automatically. must use doc.markModified('pathToYourDate') before saving changes.
            default: Date.now,
        },
        time: {
            type: Number, // integer in seconds. ex 5000 = 5000/3600Hrs, (5000%3600)/60Min, (5000%60)Sec.
            default: 0,
        },
        workout: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    auto: true,
                },
                machineId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user.machines",
                    required: true,
                },
                sets: [
                    {
                        _id: {
                            type: mongoose.Schema.Types.ObjectId,
                            auto: true,
                        },
                        attributeValues: [
                            {
                                name: String,
                                value: Number,
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

const sessionModel = mongoose.model("session", sessionSchema);
export type sessionType = mongoose.InferSchemaType<typeof sessionSchema>;
export default sessionModel;
