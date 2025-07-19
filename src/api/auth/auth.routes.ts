import { Router } from "express";
import passport from "passport";
import { container } from "tsyringe";
import { AuthController } from "./auth.controller";

const controller = container.resolve(AuthController);

const router = Router();

router
  .post(
    '/login',
    passport.authenticate('local', { session: false }),
    controller.login
  )

  .get(
    '/profile',
    passport.authenticate('jwt', { session: false }),
    controller.getProfile
  );

export default router