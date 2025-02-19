import mongoose from "mongoose";

//defines the schema for machine.
const machineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        muscle: {
            type: String,
            required: true,
            trim: true,
        },
    },
    // {
    //     collection: "machines",
    //     //_id: false, //uncomment once machine is a subdocument of user. As a primary document _id is mandetory.
    // },
);

//Schema for machine.
const machineModel = mongoose.model("machine", machineSchema);
//type for a machine
export type machineType = mongoose.InferSchemaType<typeof machineModel.schema>; //typescript  type inference.
export default machineModel;
