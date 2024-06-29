import card from "../models/card";
import { NextFunction, Request, Response } from "express";
import BadRequest from "../utils/errors/BadRequest";
import Forbidden from "../utils/errors/Forbidden";
import NotFound from "../utils/errors/notFound";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
	card
		.find({})
		.then((cards) => res.status(200).send(cards))
		.catch(next);
};

export const createCard = (req: any, res: Response, next: NextFunction) => {
	const { name, link } = req.body;
	card
		.create({
			name,
			link,
			owner: req.user._id
		})
		.then((cardData) => res.status(200).send(cardData))
		.catch((err) => {
			if (err.name === "ValidationError") {
				next(
					new BadRequest(
						"Переданы некорректные данные при создании карточки"
					)
				);
			} else {
				next(err);
			}
		});
};

export const deleteCard = (req: any, res: Response, next: NextFunction) => {
	card
		.findByIdAndRemove(req.params.cardId)
		.then((cardData) => {
			if (!cardData) {
				throw new NotFound("Карточка по указанному _id не найдена");
			} else if (cardData.owner.toString() !== req.user._id) {
				throw new Forbidden("Нельзя удалить карточку другого пользователя");
			} else {
				card
					.deleteOne({ _id: req.params.cardId })
					.then(() => {
						res.status(200).send({ message: "Карточка удалена" });
					})
					.catch(next);
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

export const addLikeCard = (req: any, res: Response, next: NextFunction) => {
	card
		.findByIdAndUpdate(
			req.params.cardId,
			{ $addToSet: { likes: req.user._id } },
			{ new: true, runValidators: true }
		)
		.then((cardData) => {
			if (!cardData) {
				throw new NotFound("Карточка по указанному _id не найдена");
			} else {
				res.status(200).send(cardData);
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

export const deleteLikeCard = (req: any, res: Response, next: NextFunction) => {
	card
		.findByIdAndUpdate(
			req.params.cardId,
			{ $pull: { likes: req.user._id } },
			{ new: true }
		)
		.then((cardData) => {
			if (!cardData) {
				throw new NotFound("Карточка по указанному _id не найдена");
			} else {
				res.status(200).send(cardData);
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
