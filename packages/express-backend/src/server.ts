import express from "express";
import cors from "cors";
import machineRoutes from "./routes/machineRoutes";

import mongoose from "mongoose";

//----- Connect Listener -----
//Setup Backend to listen for HTTP requests.
//Also add all enpoints from other files.
const app = express();
const PORT = 8000;

app.use(cors());
//parser.
app.use(express.json());

//add Routes
app.use("/machines", machineRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//----- Connect mongoDB -----
//Setup connection to mongoDB.
mongoose.set("debug", true);

mongoose
    .connect("mongodb://localhost:27017/Workout_In_Progress", {
        //useNewUrlParser: true, //default for mongoose 6+
        //useUnifiedTopology: true //default for mongoose 6+
    })
    .then(() => console.log("Connected to MongoDB."))
    .catch((error) => console.log(error));

export default app;
