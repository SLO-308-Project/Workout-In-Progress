import mongoose from "mongoose";

const userList = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
        },
    },
    {
        collection: "userLists",
    },
);

const userListSchema = mongoose.model("userList", userList);
export type userListType = mongoose.InferSchemaType<typeof userList>;
export default userListSchema;
