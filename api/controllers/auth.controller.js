import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const singup = async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(req.body)
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("user successfully created");
  } catch (error) {

    next(error);
  }
};
