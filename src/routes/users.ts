import { Router } from "express";
import {
	getUsers,
	getUser,
	updateUser,
	updateUserAvatar,
	getCurrentUser
} from "../controllers/users";
import {
	getUserValidation,
	updateUserAvatarValidation,
	updateUserValidation
} from "../utils/validations";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/me", getCurrentUser);
userRouter.get("/:userId", getUserValidation, getUser);
userRouter.patch("/me", updateUserValidation, updateUser);
userRouter.patch("/me/avatar", updateUserAvatarValidation, updateUserAvatar);

export default userRouter;
