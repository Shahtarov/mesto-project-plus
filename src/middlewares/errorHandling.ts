import { Request, Response, NextFunction } from "express";
import { ERROR_SERVER } from "../utils/error";

export default (
	err: { statusCode: number; message: string },
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { statusCode = ERROR_SERVER, message } = err;
	res.status(statusCode).send({
		message: statusCode === ERROR_SERVER ? "Ошибка сервера" : message
	});
	next();
};
