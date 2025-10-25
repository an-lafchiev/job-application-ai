import express from "express";
import { json } from "body-parser";
import routes from "@/routes/index";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { isTest } from "env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import conversationRoutes from "./routes/conversationRoutes";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan("dev", {
    skip: () => isTest(),
  })
);
app.use(json());

app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);

app.use(errorHandler);

export default app;
