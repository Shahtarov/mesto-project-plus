import { Router } from "express";
import { getUsers, getUser, createUser, updateUser, updateUserAvatar } from "../controllers/users";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.post("/", createUser);
userRouter.get("/:userId", getUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
