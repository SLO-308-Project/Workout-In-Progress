import mongoose from "mongoose";
// import machineModel from "./machine";

const templateListSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        templateIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "sessionTemplate",
            },
        ],
    },
    {
        collection: "templateLists",
    },
);

const templateListModel = mongoose.model("templateList", templateListSchema);
export type templateListType = mongoose.InferSchemaType<
    typeof templateListSchema
>;
export default templateListModel;
