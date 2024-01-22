import express from "express";
import {
  getAllUsers,
  login,
  register,
  getUser,
  updateUser,
  deleteUser,
  logout,
  forgotPassword,
  verifyToken,
} from "../controllers/user.js";

import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/auth/register").post(register);
router.route("/auth/login").post(login);
router.route("/all-users").get(getAllUsers);
router.route("/:username").get(getUser);
router.route("/auth/logout").post(authenticateUser, logout);
router.route("/update").put(authenticateUser, updateUser);
router.route("/delete").put(authenticateUser, deleteUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/auth/verify/:email/:token").post(verifyToken);

export default router;
