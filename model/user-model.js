const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    //required: [true, "name must be required"],
    trim: true,
    maxlength: 20,
  },
  googleId: {
    type: Number,
    //required: [true, " google id is required"],
  },
  email: {
    type: String,
    required: [true, "email is must"],
    validate: isEmail,
  },
  password: {
    type: String,
    minlength: [4, "passowrd should be minimum of length 4"],
    maxlength: [12, "password length is too long maximum is 12"],
    required: [true, "password is very  much required"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "you must enter the passwordConfirm field"],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: "{PATH} and {VALUE} is not the same",
    },
  },
  username: {
    type: String,
    required: true,
  },
  passwordChangedAt: Date,
  image: String,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

userSchema.methods.verifyPassword = async function (
  clientPassword,
  dbPassword
) {
  return await bcrypt.compare(clientPassword, dbPassword);
};

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now();
  next();
});

userSchema.methods.isPasswordChangedAfter = function (iat) {
  if (!this.passwordChangedAt) return false;
  return this.passwordChangedAt > iat;
};

module.exports = mongoose.model("User", userSchema);
