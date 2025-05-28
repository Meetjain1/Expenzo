import express from 'express';
import { loginControllers, registerControllers, setAvatarController, editProfileController, googleLoginController } from '../controllers/userController.js';

const router = express.Router();

router.route("/register").post(registerControllers);

router.route("/login").post(loginControllers);

router.route("/setAvatar/:id").post(setAvatarController);

router.route("/editProfile/:id").put(editProfileController);

router.route("/google-login").post(googleLoginController);

export default router;