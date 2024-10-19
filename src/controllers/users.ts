import user from "../models/user";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import secretKey from "../utils/secretKey";
import NotFound from "../utils/errors/notFound";
import Conflict from "../utils/errors/Conflict";
import BadRequest from "../utils/errors/BadRequest";

interface IRequest extends Request {
	user?: { _id: string };
}

export const login = (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;

	user
		.findUserByCredentials(email, password)
		.then((authUser) => {
			res.send({
				token: jwt.sign({ _id: authUser._id }, secretKey, {
					expiresIn: "7d"
				})
			});
		})
		.catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
	const { email, password, name, about, avatar } = req.body;
	bcrypt
		.hash(password, 10)
		.then((hash) =>
			user.create({
				email,
				password: hash,
				name,
				about,
				avatar
			})
		)
		.then((user) => {
			res.status(201).send({
				_id: user._id,
				name: user.name,
				about: user.about,
				avatar: user.avatar,
				email: user.email
			});
		})
		.catch((err) => {
			if (err.code === 11000) {
				next(new Conflict("Пользователь с таким email уже существует"));
			} else if (err.name === "ValidationError") {
				next(
					new BadRequest(
						"Переданы некорректные данные при создании пользователя"
					)
				);
			} else {
				next(err);
			}
		});
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
	user
		.find({})
		.then((users) => res.status(200).send(users))
		.catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
	user
		.findById(req.params.userId)
		.then((user) => {
			if (!user) {
				throw new NotFound("Пользователь по указанному _id не найден");
			} else {
				res.status(200).send(user);
			}
		})
		.catch((err) => {
			if (err.name === "CastError") {
				next(new BadRequest("Некорректный id"));
			} else {
				next(err);
			}
		});
};

export const getCurrentUser = (
	req: IRequest,
	res: Response,
	next: NextFunction
) => {
	user
		.findById(req.user?._id)
		.then((user) => {
			if (!user) {
				throw new NotFound("Пользователь по указанному _id не найден");
			} else {
				res.send(user);
			}
		})
		.catch((err) => {
			if (err.name === "CastError") {
				next(new BadRequest("Некорректный id"));
			} else {
				next(err);
			}
		});
};

export const updateUser = (
	req: IRequest,
	res: Response,
	next: NextFunction
) => {
	const { name, about } = req.body;
	const userId = req.user?._id;

	user
		.findByIdAndUpdate(
			userId,
			{ name, about },
			{ new: true, runValidators: true }
		)
		.then((user) => {
			if (!user) {
				throw new NotFound("Пользователь по указанному _id не найден");
			} else {
				res.status(200).send(user);
			}
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				next(
					new BadRequest(
						"Переданы некорректные данные при обновлении аватара"
					)
				);
			} else if (err.name === "CastError") {
				next(new BadRequest("Некорректный id"));
			} else {
				next(err);
			}
		});
};

export const updateUserAvatar = (
	req: IRequest,
	res: Response,
	next: NextFunction
) => {
	const { avatar } = req.body;
	const userId = req.user?._id;

	if (avatar === undefined) {
		throw new BadRequest(
			"Переданы некорректные данные при обновлении аватара"
		);
	}

	user
		.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
		.then((user) => {
			if (!user) {
				throw new NotFound("Пользователь по указанному _id не найден");
			} else {
				res.status(200).send(user);
			}
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				next(
					new BadRequest(
						"Переданы некорректные данные при обновлении аватара"
					)
				);
			} else if (err.name === "CastError") {
				next(new BadRequest("Некорректный id"));
			} else {
				next(err);
			}
		});
};
