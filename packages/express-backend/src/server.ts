import express from "express";
import cors from "cors";
import machineRoutes from "./routes/machineRoutes";
import userRoutes from "./routes/userRoutes";

import mongoose from "mongoose";

const app = setupAPP(8000);
connectDB("mongodb://localhost:27017/Workout_In_Progress");
//----- Connect Listener -----
function setupAPP(PORT: number)
{
    //Setup Backend to listen for HTTP requests.
    //Also add all enpoints from other files.
    const app = express();

    app.use(cors());
    //parser.
    app.use(express.json());

    //add Routes
    app.use(machineRoutes);
    app.use(userRoutes);

    app.listen(PORT, () =>
    {
        console.log(`Server is running on port ${PORT}`);
    });
    return app;
}

//----- Connect mongoDB -----
function connectDB(URI: string)
{
    //Setup connection to mongoDB.
    mongoose.set("debug", true);

    mongoose
        .connect(URI, {
            //useNewUrlParser: true, //default for mongoose 6+
            //useUnifiedTopology: true //default for mongoose 6+
        })
        .then(() => console.log("Connected to MongoDB."))
        .catch((error) => console.log(error));
}

export default app;
