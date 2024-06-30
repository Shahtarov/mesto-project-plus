import { Joi, celebrate, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";

// Error messages
const messages = {
	required: "обязателен",
	empty: "не может быть пустым",
	min: "не может быть короче {#limit} символов",
	max: "не может быть длиннее {#limit} символов",
	invalidUrl: "Некорректная ссылка",
	invalidId: "Несуществующий id"
};

// Validators
const EMAIL_VALIDATION = Joi.string()
	.required()
	.email()
	.messages({
		"any.required": `Email ${messages.required}`,
		"string.empty": `Email ${messages.empty}`
	});

const PASSWORD_VALIDATION = Joi.string()
	.required()
	.messages({
		"any.required": `Пароль ${messages.required}`,
		"string.empty": `Пароль ${messages.empty}`
	});

const NAME_VALIDATION = Joi.string()
	.min(2)
	.max(30)
	.messages({
		"string.min": messages.min.replace("{#limit}", "2"),
		"string.max": messages.max.replace("{#limit}", "30"),
		"string.empty": `Имя ${messages.empty}`
	});

const ABOUT_VALIDATION = Joi.string()
	.min(2)
	.max(30)
	.messages({
		"string.min": messages.min.replace("{#limit}", "2"),
		"string.max": messages.max.replace("{#limit}", "30"),
		"string.empty": `Информация ${messages.empty}`
	});

const URL_PATTERN =
	/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const AVATAR_VALIDATION = Joi.string()
	.pattern(URL_PATTERN)
	.messages({
		"any.required": `Аватар ${messages.required}`,
		"string.empty": `Аватар ${messages.empty}`,
		"string.pattern.base": messages.invalidUrl
	});

const LINK_VALIDATION = Joi.string()
	.required()
	.messages({
		"any.required": `Ссылка ${messages.required}`
	});

const ID_VALIDATION = Joi.string()
	.required()
	.custom((value, helpers) => {
		if (!isValidObjectId(value)) {
			return helpers.error("any.invalid", { value });
		}
		return value;
	})
	.messages({
		"any.required": `ID ${messages.required}`,
		"any.invalid": messages.invalidId
	});

// Validation schemas
export const signinValidation = celebrate({
	[Segments.BODY]: Joi.object().keys({
		email: EMAIL_VALIDATION,
		password: PASSWORD_VALIDATION
	})
});

export const createUserValidation = celebrate({
	[Segments.BODY]: Joi.object().keys({
		name: NAME_VALIDATION,
		about: ABOUT_VALIDATION,
		avatar: AVATAR_VALIDATION,
		email: EMAIL_VALIDATION,
		password: PASSWORD_VALIDATION
	})
});

export const getUserValidation = celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		userId: ID_VALIDATION
	})
});

export const updateUserValidation = celebrate({
	[Segments.BODY]: Joi.object().keys({
		name: NAME_VALIDATION,
		about: ABOUT_VALIDATION
	})
});

export const updateUserAvatarValidation = celebrate({
	[Segments.BODY]: Joi.object().keys({
		avatar: AVATAR_VALIDATION.required()
	})
});

export const createCardValidation = celebrate({
	[Segments.BODY]: Joi.object().keys({
		name: NAME_VALIDATION,
		link: LINK_VALIDATION
	})
});

export const cardValidation = celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		cardId: ID_VALIDATION
	})
});
