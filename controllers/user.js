import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors/index.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { firstName: user.firstName, lastName: user.lastName }, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Put in your email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("User does not exist");
  }
  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    throw new UnauthenticatedError("Invalid password");
  }
  const token = user.createJWT();
  await user.findOneAndUpdate({ token: token });
  res.status(StatusCodes.OK).json({ user: { firstName: user.firstName, lastName: user.lastName }, token });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ users });
};

export const getUser = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username });
  if (!user) {
    throw new NotFoundError(`User with username ${username} does not exist`);
  }
  res.status(StatusCodes.OK).json({ user });
};

export const updateUser = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOneAndUpdate({ _id: userId }, req.body, { new: true, runValidators: true });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ user });
};

export const deleteUser = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOneAndDelete({ _id: userId });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).send();
};

export const logout = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const payload = jwt.sign(token, "-10s");
  res.status(StatusCodes.OK).send();
};
