import mongoose from "mongoose";
// import machineModel from "./machine";

const sessionTemplateSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        machineIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "machine",
            },
        ],
        workout: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    auto: true,
                },
                machineId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "machine",
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
        collection: "sessionTemplates",
    },
);

const sessionTemplateModel = mongoose.model(
    "sessionTemplate",
    sessionTemplateSchema,
);
export type sessionTemplateType = mongoose.InferSchemaType<
    typeof sessionTemplateSchema
>;
export default sessionTemplateModel;
