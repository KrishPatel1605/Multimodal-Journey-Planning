import express from "express";
import bodyParser from "body-parser";
import routeRoutes from "./routes/routeRoutes.js";

const app = express();

app.use(bodyParser.json());
app.use("/api/routes", routeRoutes);

export default app;
