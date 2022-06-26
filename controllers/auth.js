const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { User, userValidate } = require("../models/user");
const { SECRET_KEY } = process.env;
const gravatar = require("gravatar");

const signup = async (req, res, next) => {
  const { error } = userValidate.validate(req.body);

  try {
    if (error) {
      throw new Error(error.message);
    }

    const { email } = req.body;
    const isUser = await User.findOne({ email });
    if (isUser) {
      throw new Error("Email in use");
    }
    const hashPassword = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(10)
    );
    req.body.password = hashPassword;
    req.body.avatarURL = gravatar.url(email);
    const user = await User.create(req.body);
    res.status(201).json({
      user: {
        email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (e) {
    res.status(409).json({ message: e.message });
    next(e);
  }
};

const login = async (req, res, next) => {
  const { error } = userValidate.validate(req.body);

  try {
    if (error) {
      throw new Error(error.message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error("Email or password is wrong");
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
      user: {
        email,
        subscription: user.subscription,
      },
    });
  } catch (e) {
    res.status(401).json({ message: e.message });
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: null });

    res.status(204).json();
  } catch (e) {
    res.status(404).json({ message: "Not found" });
    next(e);
  }
};

const current = async (req, res, next) => {
  if (!req.user) {
    res.ststus(401).json({ message: "Not authorized" });
  }
  console.log(req.user);
  const { email, subscription } = req.user;
  res.ststus(200).json({
    status: "succes",
    code: 200,
    data: {
      user: {
        email,
        subscription,
      },
    },
  });
};

const avatars = async (req, res, next) => {
  const avatarsDir = path.join(__dirname, "../", "public", "avatars");
  const imageName = `${req.user.id}_${req.file.originalname}`;
  const resultUpload = path.join(avatarsDir, imageName);
  const avatarURL = path.join("public", "avatars", imageName);
  const tempUpload = req.file.path;

  try {
    Jimp.read(tempUpload, (error, avatar) => {
      if (error) {
        res.status(401).json({
          message: "unsupported file",
        });
        throw error;
      }

      avatar
        .resize(250, 250) // resize
        .quality(60) // set JPEG quality
        .write(resultUpload); // save
    });

    await fs.rename(tempUpload, resultUpload);
    await User.findByIdAndUpdate(req.user.id, { avatarURL });
    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempUpload);
    res.status(401).json({
      message: "Not authorized",
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
  avatars,
};
