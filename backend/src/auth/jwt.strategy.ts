import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: any) {
    console.log('Validating JWT token with payload:', payload);

    const isBlacklisted = await this.authService.isTokenBlacklisted(
      payload.jti,
    );
    if (isBlacklisted) {
      console.error('Token is blacklisted');
      throw new UnauthorizedException('Token is invalid');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      console.error('User not found for the given payload:', payload);
      throw new UnauthorizedException('Invalid token');
    }

    console.log('Token is valid, user found:', user);
    return { userId: payload.sub, email: payload.email, ...user.toObject() };
  }
}
