import mongoose from "mongoose";

const userListSchema = new mongoose.Schema(
    {
        userId: {
            //reference to a user._id
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    },
    {
        collection: "userLists",
    },
);

const userListModel = mongoose.model("userList", userListSchema);
export type userListType = mongoose.InferSchemaType<typeof userListModel>;
export default userListModel;
