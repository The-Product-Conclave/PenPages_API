import { Likes } from "../models/likes.js";
import { StatusCodes } from "http-status-codes";

export const like = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;
  const liked = await Likes.findOne({ post: postId, user: userId });
  console.log(liked);
  if (liked) {
    await Likes.findOneAndDelete({ post: postId, user: userId });
  } else {
    await Likes.create({ post: postId, user: userId });
  }
  const likes = (await Likes.find({ post: postId })).length;
  res.status(StatusCodes.OK).json({ likes: likes });
};
