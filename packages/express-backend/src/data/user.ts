import mongoose from "mongoose";
import machineSchema from "./machine";

const user = new mongoose.Schema(
    {
        name: {},
        email: {},
        sessionLogId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        machines: [
            {
                machine: {
                    type: machineSchema,
                },
            },
        ],
    },
    {
        collection: "users",
    },
);

const userSchema = mongoose.model("user", user);
export type userType = mongoose.InferSchemaType<typeof user>;
export default userSchema;
