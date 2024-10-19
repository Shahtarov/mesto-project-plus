import card from "../models/card";
import { NextFunction, Request, Response } from "express";
import BadRequest from "../utils/errors/BadRequest";
import Forbidden from "../utils/errors/Forbidden";
import NotFound from "../utils/errors/notFound"

interface IRequest extends Request {
	user?: { _id: string };
}

export const getCards = (req: Request, res: Response, next: NextFunction) => {
	card
		.find({})
		.then((cards) => res.status(200).send(cards))
		.catch(next);
};

export const createCard = (
	req: IRequest,
	res: Response,
	next: NextFunction
) => {
	const { name, link } = req.body;
	const userId = req.user?._id;

	card
		.create({
			name,
			link,
			owner: userId
		})
		.then((cardData) => res.status(201).send(cardData))
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

export const deleteCard = (
	req: IRequest,
	res: Response,
	next: NextFunction
) => {
	const { cardId } = req.params;
	const userId = req.user?._id;

	card
		.findById(cardId)
		.then((cardData) => {
			if (!cardData) {
				throw new NotFound("Карточка по указанному _id не найдена");
			} else if (cardData.owner.toString() !== userId) {
				throw new Forbidden("Нельзя удалить карточку другого пользователя");
			} else {
				card
					.deleteOne({ _id: cardId })
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

export const addLikeCard = (
	req: IRequest,
	res: Response,
	next: NextFunction
) => {
	const userId = req.user?._id;

	card
		.findByIdAndUpdate(
			req.params.cardId,
			{ $addToSet: { likes: userId } },
			{ new: true, runValidators: true }
		)
		.then((cardData) => {
			if (!cardData) {
				throw new NotFound("Карточка по указанному _id не найдена");
			} else {
				res.status(201).send(cardData);
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

export const deleteLikeCard = (
	req: IRequest,
	res: Response,
	next: NextFunction
) => {
	const userId = req.user?._id;

	card
		.findByIdAndUpdate(
			req.params.cardId,
			{ $pull: { likes: userId } },
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
