import mongoose from "mongoose";
//import machineModel from "./machine.js";

mongoose.set("debug", true);

mongoose
    .connect("mongodb://localhost:27017/Workout_In_Progress", {
        //useNewUrlParser: true, //default for mongoose 6+
        //useUnifiedTopology: true //default for mongoose 6+
    })
    .then(() => console.log("Connected to MongoDB."))
    .catch((error) => console.log(error));
