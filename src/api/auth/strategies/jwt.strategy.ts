import {
  Strategy as JwtStrategyBase,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback
} from 'passport-jwt';
import { injectable } from 'tsyringe';
import { env } from '../../../config/env';

@injectable()
export class JwtStrategy extends JwtStrategyBase {
  constructor() {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_SECRET
    };

    super(options, async (payload: any, done: VerifiedCallback) => {
      await this.validate(payload, done);
    });
  }

  private async validate(payload: any, done: VerifiedCallback) {
    try {
      done(null, payload);
    } catch (err) {
      done(err, false);
    }
  }
}
