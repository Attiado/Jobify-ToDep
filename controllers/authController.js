import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import BadRequestError from "../errors/bad-request.js";
import UnAuthenticatedError from "../errors/unauthenticated.js";
import User from "../models/User.js";
import attachCookies from "../utils/attachCookies.js";
morgan;
const register = async (req, res) => {
  // we have removed the try-catch statement because of error-async express package for errors
  const user = await User.create(req.body);
  const token = user.createJWT();
  attachCookies({res,token});
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    //token  ( removed from front end)
    location:user.location
  });
  // Pass to the next middleware in the pipeline
  //next(error)
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  //console.log(user);
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials , pass is incorrect");
  }
  const token = user.createJWT();
  user.password = undefined;

  attachCookies({res,token});
  res.status(StatusCodes.OK).json({ user, location: user.location });

};

const updateUser = async (req, res) => {
  try {
    const { email, name, lastName, location } = req.body;
    if (!email || !name || !lastName || !location) {
      throw new BadRequestError("Please Provide all values");
    }
    const user = await User.findOne({ _id: req.user.userId });

    user.email = email;
    user.name = name;
    user.lastName = lastName;
    user.location = location;

    await user.save();

    const token = user.createJWT();
    attachCookies({res,token});

    console.log(`The  token " ${token}`);
    res.status(StatusCodes.OK).json({ user, location: user.location });
  } catch (error) {
    console.log("error while update user");
  }
};

const getCurrentUser = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId });
    res.status(StatusCodes.OK).json({ user, location: user.location });
  };

const getAllUsers = async (req, res) => {
  res.send(`all users:${res.body}`);
};

export { register, login, updateUser, getAllUsers , getCurrentUser};
