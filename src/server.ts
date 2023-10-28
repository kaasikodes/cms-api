import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import { ENV } from "./config/enviroment";
import v1 from "./routes/v1";
import errorHandler from "./middleware/errorHandler";

export const createServer = () => {
  const app = express();
  app
    .use(
      cors({
        credentials: true,
      })
    )
    .use(compression())
    .use(cookieParser())
    .use(bodyParser.json());

  app.get("/ping-health", (req, res) => {
    return res.json({ ok: true, environment: ENV.NODE_ENV });
  });

  app.use("/api/v1", v1);

  app.use(errorHandler);

  return app;
};
