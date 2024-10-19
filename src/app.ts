import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import { errors } from "celebrate";
import path from "path";
import rateLimit from "express-rate-limit";

import router from "./routes";
import NotFound from "./utils/errors/notFound";
import "dotenv/config";
import { createUser, login } from "controllers/users";
import auth from "middlewares/auth";
import errorHandling from "middlewares/errorHandling";

import { errorLogger, requestLogger } from "middlewares/logger";

const { PORT = 3000, DATABASE_URL = "mongodb://127.0.0.1:27017/mestodb" } =
	process.env;

const app = express();
mongoose.set("strictQuery", true);
mongoose.connect(DATABASE_URL);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: "Слишком много запросов с этого IP, пожалуйста, попробуйте позже.",
	headers: true
});
app.use(limiter);

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);
app.use(router);

app.use(express.static(path.join(__dirname, "dist")));

app.use((req: Request, res: Response, next: NextFunction) => {
	console.log(`Error: Request URL: ${req.url}`);
	next(new NotFound("Запрашиваемый ресурс не найден"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandling);

app.listen(PORT, () => {
	console.log(`Server is running. Port: ${PORT}`);
	console.log(`Connecting to database at ${DATABASE_URL}`);
});
