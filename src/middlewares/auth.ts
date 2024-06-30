import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import secretKey from "../utils/secretKey";
import Unathorized from "../utils/errors/Unathorized";

interface ISessionRequest extends Request {
	user?: string | jwt.JwtPayload;
}

export default (req: ISessionRequest, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;
	if (!authorization || !authorization.startsWith("Bearer ")) {
		throw new Unathorized("Необходима авторизация");
	}

	const token = authorization!.replace("Bearer ", "");
	let payload;

	try {
		payload = jwt.verify(token, secretKey);
	} catch (err) {
		throw new Unathorized("Необходима авторизация");
	}

	req.user = payload;
	// req.user = payload;
	// req.user = payload as { _id: jwt.JwtPayload };
	next();
};
