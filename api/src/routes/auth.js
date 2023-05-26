const router = require("express").Router();
const User = require("../models/User");
const createError = require("http-errors");
const { validateUserData } = require("../utils/joi_data_validation");
const { signAccessToken, signRefreshToken } = require("../utils/JWT_helper");

//REGISTER
router.post("/register", async (req, res, next) => {
  try {
    const userData = await validateUserData.validateAsync(req.body);
    const isExistingUser = await User.findOne({ email: userData.email });

    if (isExistingUser)
      throw createError.Conflict(`${userData.email} already exists!`);

    const newUser = new User(userData);

    const savedUser = await newUser.save();
    const accessToken = await signAccessToken(savedUser._id, savedUser.isAdmin);

    const refreshToken = await signRefreshToken(
      savedUser._id,
      savedUser.isAdmin
    );

    const { password, confirm_password, ...others } = savedUser._doc;
    res.status(200).json({ ...others, accessToken, refreshToken });
  } catch (err) {
    if (err.isJoi) err.status = 422;
    next(err);
  }
});

//LOGIN

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const isExistingUser = await User.findOne({ username });

    if (!isExistingUser)
      throw createError.NotAcceptable(`"${username}" is not registered`);

    const isCorrectPassword = await isExistingUser.isValidPassword(password);

    if (!isCorrectPassword)
      throw createError.Unauthorized(`Email/ Password is incorrect`);

    const accessToken = await signAccessToken(
      isExistingUser.id,
      isExistingUser.isAdmin
    );
    const refreshToken = await signRefreshToken(
      isExistingUser.id,
      isExistingUser.isAdmin
    );

    const {
      password: hashedPassword,
      confirm_password,
      ...others
    } = isExistingUser._doc;

    res.status(200).json({ ...others, accessToken, refreshToken });
  } catch (err) {
    if (err.isJoi) err.status = 422;
    next(err);
  }
});

module.exports = router;
