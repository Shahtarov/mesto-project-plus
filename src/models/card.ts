import mongoose, { model, Schema } from "mongoose";
import validator from "validator";

interface ICard {
	name: string;
	link: string;
	owner: mongoose.Types.ObjectId;
	likes: Array<mongoose.Types.ObjectId>;
	createdAt: Date;
}

const cardSchema = new Schema<ICard>({
	name: {
		type: String,
		minlength: 2,
		maxlength: 30,
		required: true
	},
	link: {
		type: String,
		required: true,
		validate: {
			validator: (avatar: string) =>
				validator.isURL(avatar, { protocols: ["http", "https"] }),
			message: "Некорректный URL"
		}
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "user",
		required: true
	},
	likes: [
		{
			type: Schema.Types.ObjectId,
			ref: "user",
			required: true,
			default: []
		}
	],
	createdAt: {
		type: Date,
		default: Date.now()
	}
});

export default model<ICard>("card", cardSchema);
