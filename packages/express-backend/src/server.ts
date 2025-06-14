import express, {Application} from "express";
import cors from "cors";
import machineRoutes from "./routes/machineRoutes";
import userRoutes from "./routes/userRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import workoutRoutes from "./routes/workoutRoutes";
import templateRoutes from "./routes/templateRoutes";
import defaultRoute from "./routes/default";
import {getEnv} from "./util/env";
import {authToken} from "./util/jwt";

import mongoose from "mongoose";

const app: Application = setupAPP(8000);

//----- Connect Listener -----
function setupAPP(PORT: number)
{
    //Setup Backend to listen for HTTP requests.
    //Also add all endpoints from other files.
    const app = express();

    //Remove localhost later.
    app.use(
        cors({
            origin: [
                "https://orange-bush-0991c211e.6.azurestaticapps.net",
                "http://localhost:8081",
                "http://localhost:8082",
            ],
            credentials: true,
        }),
    );
    //parser.
    app.use(express.json());

    //Test Route
    app.use("/", defaultRoute);

    //add Routes, authToken for protected route
    app.use("/machines", authToken, machineRoutes);
    app.use("/users", userRoutes);
    app.use("/sessions", authToken, sessionRoutes);
    app.use("/current", authToken, workoutRoutes);
    app.use("/workouts", authToken, workoutRoutes);
    app.use("/templates", authToken, templateRoutes);

    // Only run in when directly used in file
    if (require.main === module)
    {
        const DB: string | undefined = getEnv("DB_URL");
        connectDB(DB);
        app.listen(process.env.PORT || PORT, () =>
        {
            console.log("REST API is listening.");
        });
    }
    return app;
}

//----- Connect mongoDB -----
function connectDB(URI: string)
{
    //Setup connection to mongoDB.
    mongoose.set("debug", true);

    mongoose
        .connect(URI, {})
        .then(() => console.log("Connected to MongoDB."))
        .catch((error) => console.log(error));
}

export default app;
export {connectDB};
