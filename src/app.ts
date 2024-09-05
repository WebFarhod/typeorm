import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/index";
import ErrorMiddleware from "./middlewares/error.middleware";

import swaggerDocs from "./swagger";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
const app = express();
app.use(limiter);
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api", apiRouter);
app.use("/uploads", express.static("uploads"));
swaggerDocs(app);

app.use(ErrorMiddleware);

export default app;
