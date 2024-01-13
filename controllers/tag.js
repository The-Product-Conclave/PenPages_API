import { StatusCodes } from "http-status-codes";
import Tag from "../models/tag";

export const createTag = async (req, res) => {
	const tag = await Tag.create({ ...req.body });
	res.status(StatusCodes.CREATED).json({ tag });
};

export const getAllTags = async (req, res) => {
	const tags = await Tag.find({});
	res.status(StatusCodes.OK).json({ tags });
};