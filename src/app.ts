import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import path from "path";
require('dotenv').config();

import userRouter from './routes/users';
import cardRouter from './routes/cards';
import NotFound from "./utils/errors/notFound";

const { PORT = 3000, DATABASE_URL = "mongodb://127.0.0.1:27017/mestodb"} = process.env;

const app = express();
mongoose.set('strictQuery', true);
mongoose.connect(DATABASE_URL);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "dist")));

app.use((req: any, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6680028dc9f64c40b2a8e041'
  };

  next();
});

app.use("/users", userRouter);
app.use("/cards", cardRouter);


app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Request URL: ${req.url}`);
  next(new NotFound('Запрашиваемый ресурс не найден'));
});

app.listen(PORT, () => {
  console.log(`Server is running. Port: ${PORT}`);
  console.log(`Connecting to database at ${DATABASE_URL}`);
});
