import { Model, model, Schema, Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import Unathorized from "../utils/errors/Unathorized";

interface IUser {
	name: string;
	about: string;
	avatar: string;
	email: string;
	password: string;
}

interface IUserModel extends Model<IUser> {
	findUserByCredentials: (
		email: string,
		password: string
	) => Promise<Document<unknown, any, IUser>>;
}

const userSchema = new Schema<IUser, IUserModel>({
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: (email: string) => validator.isEmail(email),
			message: "Неправильный формат почты"
		}
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	name: {
		type: String,
		minlength: 2,
		maxlength: 30,
		default: "Жак-Ив Кусто"
	},
	about: {
		type: String,
		minlength: 2,
		maxlength: 200,
		default: "Исследователь"
	},
	avatar: {
		type: String,
		default:
			"https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
		validate: {
			validator: (avatar: string) =>
				validator.isURL(avatar, { protocols: ["http", "https"] }),
			message: "Некорректный URL"
		}
	}
});

userSchema.static(
	"findUserByCredentials",
	function findUserByCredentials(email: string, password: string) {
		return this.findOne({ email })
			.select("+password")
			.then((user) => {
				if (!user) {
					return Promise.reject(
						new Unathorized("Неправильные почта или пароль")
					);
				}
				return bcrypt.compare(password, user.password).then((matched) => {
					if (!matched) {
						return Promise.reject(
							new Unathorized("Неправильные почта или пароль")
						);
					}
					return user;
				});
			});
	}
);

export default model<IUser, IUserModel>("user", userSchema);
