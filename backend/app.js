import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routeRoutes from "./routes/routeRoutes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://optimized-journey-planning.vercel.app"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(bodyParser.json());
app.use("/api/routes", routeRoutes);

export default app;
