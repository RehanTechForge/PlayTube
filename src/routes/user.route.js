import { Router } from "express";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import registerSchema from "../validators/register.validator.js";
import loginSchema from "../validators/login.validator.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validate(registerSchema),
  registerUser
);

router.route("/login").post(validate(loginSchema), loginUser);
router.route("/refresh-access-token").post(refreshAccessToken);

export default router;
