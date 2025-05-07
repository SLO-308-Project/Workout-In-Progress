"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const machineRoutes_1 = __importDefault(require("./routes/machineRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const sessionRoutes_1 = __importDefault(require("./routes/sessionRoutes"));
const workoutRoutes_1 = __importDefault(require("./routes/workoutRoutes"));
const templateRoutes_1 = __importDefault(require("./routes/templateRoutes"));
const default_1 = __importDefault(require("./routes/default"));
const env_1 = require("./util/env");
const mongoose_1 = __importDefault(require("mongoose"));
const app = setupAPP(8000);
//connectDB("mongodb://localhost:27017/Workout_In_Progress");
const DB = (0, env_1.getEnv)("DB_URL");
connectDB(DB);
//----- Connect Listener -----
function setupAPP(PORT) {
    //Setup Backend to listen for HTTP requests.
    //Also add all endpoints from other files.
    const app = (0, express_1.default)();
    //Remove localhost later.
    app.use((0, cors_1.default)({
        origin: ["https://orange-bush-0991c211e.6.azurestaticapps.net", "http://localhost:8081"],
        credentials: true,
    }));
    //parser.
    app.use(express_1.default.json());
    //Test Route
    app.use("/", default_1.default);
    //add Routes
    app.use("/machines", machineRoutes_1.default);
    app.use("/users", userRoutes_1.default);
    app.use("/sessions", sessionRoutes_1.default);
    app.use("/current", workoutRoutes_1.default);
    app.use("/workouts", workoutRoutes_1.default);
    app.use("/templates", templateRoutes_1.default);
    app.listen(process.env.PORT || PORT, () => {
        console.log("REST API is listening.");
    });
    return app;
}
//----- Connect mongoDB -----
function connectDB(URI) {
    //Setup connection to mongoDB.
    mongoose_1.default.set("debug", true);
    mongoose_1.default
        .connect(URI, {
    //useNewUrlParser: true, //default for mongoose 6+
    //useUnifiedTopology: true //default for mongoose 6+
    })
        .then(() => console.log("Connected to MongoDB."))
        .catch((error) => console.log(error));
}
exports.default = app;
