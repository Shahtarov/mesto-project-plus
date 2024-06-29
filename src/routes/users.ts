import { Router } from "express";
import { getUsers, getUser, createUser, updateUser, updateUserAvatar } from "../controllers/users";

const userRouter = Router();

userRouter.get("/users", getUsers);
userRouter.get("/users/:userId", getUser);
userRouter.post("/users", createUser);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateUserAvatar);

export default userRouter;
