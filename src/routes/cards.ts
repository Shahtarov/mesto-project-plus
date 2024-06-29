import { Router } from "express";
import {
	getCards,
	createCard,
	deleteCard,
	addLikeCard,
	deleteLikeCard
} from "../controllers/cards";

const cardRouter = Router();

cardRouter.get("/cards", getCards);
cardRouter.post("/cards", createCard);
cardRouter.delete("/:cardId", deleteCard);
cardRouter.put("/:cardId/likes", addLikeCard);
cardRouter.delete("/:cardId/likes", deleteLikeCard);

export default cardRouter;
