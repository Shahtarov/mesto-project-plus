
import user from "../models/user";
import { NextFunction, Request, Response } from "express";
import NotFound from "../utils/errors/notFound";
import BadRequest from "../utils/errors/BadRequest";

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
	user
		.find({})
		.then((users) => res.status(200).send(users))
		.catch((res) => res.status(500).send({ message: "Произошла ошибка" }));
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

	user
		.create({
			name,
			about,
			avatar
		})
		.then((user) => {
			res.status(200).send({
				_id: user._id,
				name: user.name,
				about: user.about,
				avatar: user.avatar
			});
		})
		.catch ((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при создании пользователя'));
    } else {
      next(err);
    }
  })
  }

;

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

export const updateUser = (req: any, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
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
        next(new BadRequest("Переданы некорректные данные при обновлении аватара"));
      } else if (err.name === "CastError") {
        next(new BadRequest("Некорректный id"));
      } else {
        next(err);
      }
    })
};

export const updateUserAvatar = (req: any, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  if (avatar === undefined) {
    throw new BadRequest('Переданы некорректные данные при обновлении аватара');
  }

  user.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
   .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь по указанному _id не найден');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      } else if (err.name === 'CastError') {
        next(new BadRequest("Некорректный id"));
      } else {
        next(err);
      }
    });
}