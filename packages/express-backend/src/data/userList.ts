import mongoose from "mongoose";

const userListSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
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
export type UserListType = mongoose.InferSchemaType<typeof userListSchema>;
export default userListModel;
