import { Router } from "express";
import {
	getCards,
	createCard,
	deleteCard,
	addLikeCard,
	deleteLikeCard
} from "../controllers/cards";
import { cardValidation, createCardValidation } from "../utils/validations";

const cardRouter = Router();

cardRouter.get("/", getCards);
cardRouter.post("/", createCardValidation, createCard);
cardRouter.delete("/:cardId", cardValidation, deleteCard);
cardRouter.put("/:cardId/likes", cardValidation, addLikeCard);
cardRouter.delete("/:cardId/likes", cardValidation, deleteLikeCard);

export default cardRouter;
