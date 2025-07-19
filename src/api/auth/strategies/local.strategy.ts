import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { container, injectable } from 'tsyringe';

@injectable()
export class LocalStrategy extends Strategy {
  constructor(
    private authService: AuthService = container.resolve(AuthService)
  ) {
    super(
      {
        usernameField: 'username',
        passwordField: 'password'
      },
      async (username: string, password: string, done: any) => {
        await this.validate(username, password, done);
      }
    );
  }

  private async validate(email: string, password: string, done: any) {
    try {
      const user = await this.authService.validateUser(email, password);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
