const { User } = require("../models/auth");
const { sendConfirmationEmail } = require("../email/account");
const bcrypt = require("bcryptjs");
const { MongoTailableCursorError } = require("mongodb");

const register = async (req, res, next) => {
  const user = new User(req.body);

  try {
    let userExist = await User.findOne({ email: user.email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "Email already exist in database" });
    }

    await user.save();
    const token = await user.generateAuthToken();

    const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token}`;
    sendConfirmationEmail(user.email, url);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Wrong username or password credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(404)
        .json({ message: "Wrong username or password credentials" });
    }
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const myDetails = async (req, res) => {
  res.status(200).send(req.user);
};

const resendLink = async (req, res) => {
  const _id = req.params.id;

  try {
    let user = await User.findOne({ _id });
    if (!user.verified) {
      const url = `${process.env.BASE_URL}/users/${user._id}/verify/${user.token}`;
      sendConfirmationEmail(user.email, url);

      return res
        .status(200)
        .send({ message: "An Email sent to your account please verify" });
    } else {
      res.status(200).send({ message: "Your account is already verified" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const confirmationToken = async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).send({ message: "Invalid User" });
    }
    if (user.verified) {
      return res.status(400).send({ message: "Email already verified" });
    } else {
      user.verified = true;
      await user.save();
    }


    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  register,
  login,
  myDetails,
  confirmationToken,
  resendLink,
  logout,
};
