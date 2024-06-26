const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, Accounts } = require("../db");
const { jwt_secret } = require("../config");
const user_authentication = require("../middlewares/auth");

const user_input_schema = zod.object({
  username: zod.string(),
  first_name: zod.string(),
  last_name: zod.string(),
  email: zod.coerce.string().email("invalid email"),
  password: zod.string().min(6, "password must contain atleast 6 charaters"),
});

function input_validation(req, res, next) {
  try {
    const { username, first_name, last_name, email, password } = req.body;
    if (!(username && first_name && last_name && email && password))
      return res.status(402).json({
        message: "fill all the fields!",
        success: false,
      });
    const user_input = {
      username,
      first_name,
      last_name,
      email,
      password,
    };
    const input_validation = user_input_schema.safeParse(user_input);
    if (!input_validation.success)
      return res.status(402).json({
        message: input_validation.error.message[0].message,
        success: false,
      });
    else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(403).json({
      message: "input validation failed",
      success: false,
    });
  }
}
router.get("/", user_authentication, async (req, res) => {
  try {
    const email = req.email;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(402).json({
        message: "email is not registered",
        success: false,
      });
    res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      message: error,
      success: false,
    });
  }
});
router.post("/signin", input_validation, async (req, res) => {
  try {
    const { username, first_name, last_name, email, password } = req.body;
    const is_email_aleady_used = await User.findOne({ email });
    if (is_email_aleady_used)
      return res.status(402).json({
        message: "email already exist",
        success: false,
      });
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);
    const new_user = new User({
      username,
      first_name,
      last_name,
      email,
      hashed_password,
    });
    await new_user.save();
    const account = new Accounts({
      user_id: new_user.user_id,
      balance: Math.random() * 100000,
    });
    await account.save();
    const payload = {
      user_id: new_user.user_id,
      email,
    };
    const token = jwt.sign(payload, jwt_secret, { expiresIn: "2d" });
    res.status(200).json({
      message: "user signed in successfully",
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(403).json({
      message: error,
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password))
    return res.status(402).json({
      message: "credentials are missing",
      success: false,
    });
  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({
      message: "user not found",
      success: false,
    });
  const is_password_correct = await bcrypt.compare(
    password,
    user.hashed_password
  );
  if (!is_password_correct)
    return res.status(402).json({
      message: "password is incorrect",
      success: false,
    });
  const payload = {
    username: user.username,
    email,
  };
  const token = jwt.sign(payload, jwt_secret, { expiresIn: "1d" });
  res.status(200).json({
    message: "user logged in successfully",
    success: true,
    token,
  });
});

router.put("/update", user_authentication, async (req, res) => {
  try {
    const { new_first_name, new_last_name, new_password, new_username } =
      req.body;
    const username_schema = zod.string();
    const first_name_schema = zod.string();
    const last_name_schema = zod.string();
    const password_schema = zod
      .string()
      .min(6, "password must contain atleast 6 charaters");
    const user_id = req.user_id;
    const user = await User.findOne({ user_id });
    const is_new_password_valid =
      password_schema.safeParse(new_password).success;
    if (new_password && !is_new_password_valid)
      return res.status(402).json({
        message: "enter a valid password",
        success: false,
      });
    const is_new_first_name_valid =
      first_name_schema.safeParse(new_first_name).success;
    if (new_first_name && !is_new_first_name_valid)
      return res.status(402).json({
        message: "enter a valid first name",
        success: false,
      });
    const is_new_last_name_valid =
      last_name_schema.safeParse(new_last_name).success;
    if (new_last_name && !is_new_last_name_valid)
      return res.status(402).json({
        message: "enter a valid last name",
        success: false,
      });
    const is_new_username_valid =
      username_schema.safeParse(new_username).success;
    if (new_username && !is_new_username_valid)
      return res.status(200).json({
        message: "enter a valid username",
        success: false,
      });
    if (new_first_name) user.first_name = new_first_name;
    if (new_last_name) user.last_name = new_last_name;
    if (new_password) {
      const salt = await bcrypt.genSalt(10);
      user.hashed_password = await bcrypt.hash(new_password, salt);
    }
    if (new_username) user.username = new_username;
    await user.save();
    res.status(200).json({
      message: "user credintials have been updated",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      message: error,
      success: false,
    });
  }
});

router.get("/bulk", user_authentication, async (req, res) => {
  try {
    const filter = req.query.filter;
    if (!filter)
      return res.status(402).json({
        message: "filter is absent",
        success: false,
      });
    const matched_users = await User.find({
      $or: [
        { username: { $regrex: filter } },
        { first_name: { $regrex: filter } },
        { last_name: { $regrex: filter } },
      ],
    });
    return res.status(200).json({
      matched_users,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      message: error,
      success: false,
    });
  }
});

module.exports = router;
