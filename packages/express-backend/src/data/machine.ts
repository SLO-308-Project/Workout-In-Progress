import mongoose from "mongoose";

//defines the schema for machine.
const machine = new mongoose.Schema(
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
    {
        collection: "machines",
        versionKey: false,
        //_id: false, //uncomment once machine is a subdocument of user. As a primary document _id is mandetory.
        autoIndex: false
        
    },
);

//Schema for machine.
const machineSchema = mongoose.model("machine", machine);
//type for a machine
export type machineType = mongoose.InferSchemaType<typeof machineSchema>;
export default machineSchema;
