import cardRouter from "./cards";
import userRouter from "./users";
import { Router } from "express";

const router = Router();

router.use("/users", userRouter);
router.use("/cards", cardRouter);

export default router;
