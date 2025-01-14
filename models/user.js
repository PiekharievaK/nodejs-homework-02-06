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
});
const userValidate = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(3).max(30).required(),
});

const User = model("user", userSchema);

module.exports = {
  User,
  userValidate,
};
