const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    require: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

const userValidate = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(3).max(30).required(),
});

const verifyValidate = Joi.object({
  email: Joi.string().required(),
});

const User = model("user", userSchema);

module.exports = {
  User,
  userValidate,
  verifyValidate,
};
