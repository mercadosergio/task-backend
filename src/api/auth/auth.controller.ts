import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { container } from 'tsyringe';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = container.resolve(AuthService);
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(this.authService.signToken(req.user));
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        const user: any = req.user;
        const profile = await this.authService.getProfile(user.sub);
        res.status(200).json(profile);
      } else {
        res.status(401).json({ message: 'Usuario no autenticado' });
      }
    } catch (error) {
      next(error);
    }
  };
}
