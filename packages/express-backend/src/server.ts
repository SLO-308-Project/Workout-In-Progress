import express from "express";
import cors from "cors";
import machineRoutes from "./routes/machineRoutes";
//import app from "./app";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

//add Routes
app.use("/machines", machineRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;