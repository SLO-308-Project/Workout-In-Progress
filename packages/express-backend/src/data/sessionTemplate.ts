import mongoose from "mongoose";
// import machineModel from "./machine";

const sessionTemplateSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        name: {
            //Name can't be constrained by DB on length.
            //Recusively copying a template will append "Copy of" and eventually throw an error.
            type: String,
            required: true,
            trim: true,
        },
        machines: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    auto: true,
                },
                name: {
                    type: String,
                    required: true,
                    trim: true,
                },
                muscle: {
                    type: String,
                    required: true,
                    trim: true,
                },
                attributes: {
                    default: [],
                    type: [
                        {
                            name: {
                                type: String,
                                trim: true,
                            },
                            unit: {
                                type: String,
                                enum: [
                                    "lbs",
                                    "deg",
                                    "kgs",
                                    "s",
                                    "m",
                                    "reps",
                                    "cal",
                                ],
                                required: true,
                            },
                        },
                    ],
                },
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
