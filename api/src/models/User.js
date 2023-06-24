const mongoose = require("mongoose");
const brcypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    last_name: { type: String, required: true, unique: true },
    username: { type: String, lowercase: true, required: true, unique: true },
    email: { type: String, lowercase: true, required: true, unique: true },
    password: { type: String, required: true },
    confirm_password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    img: { type: String },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified(this.password)) next()
  try {
    const generatedSalt = await brcypt.genSalt(
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );
    const hashedPassword = await brcypt.hash(this.password, generatedSalt);
    const hashedConfirmPassword = await brcypt.hash(
      this.confirm_password,
      generatedSalt
    );
    this.password = hashedPassword;
    this.confirm_password = hashedConfirmPassword;
    next();
  } catch (error) {
    console.error("Problems with saving important details to DB", error);
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await brcypt.compare(password, this.password);
  } catch (error) {
    console.error("Problems validating user credentials", error);
    throw error;
  }
};

module.exports = mongoose.model("User", UserSchema);
