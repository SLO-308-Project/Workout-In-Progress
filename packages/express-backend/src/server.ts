import express from "express";
import cors from "cors";
import machineRoutes from "./routes/machineRoutes";
import userRoutes from "./routes/userRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import workoutRoutes from "./routes/workoutRoutes";
import templateRoutes from "./routes/templateRoutes";
import {getEnv} from "./util/env";

import mongoose from "mongoose";

const app = setupAPP(8000);
//connectDB("mongodb://localhost:27017/Workout_In_Progress");
const DB: string | undefined = getEnv("DB_URL");
connectDB(DB);

//----- Connect Listener -----
function setupAPP(PORT: number)
{
    //Setup Backend to listen for HTTP requests.
    //Also add all endpoints from other files.
    const app = express();

    app.use(cors());
    //parser.
    app.use(express.json());

    //add Routes
    app.use("/machines", machineRoutes);
    app.use("/users", userRoutes);
    app.use("/sessions", sessionRoutes);
    app.use("/current", workoutRoutes);
    app.use("/workouts", workoutRoutes);
    app.use("/templates", templateRoutes);

    app.listen(process.env.PORT || PORT, () => {
        console.log("REST API is listening.");
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
