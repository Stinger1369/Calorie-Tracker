import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service'; // Assurez-vous que ce chemin est correct
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import {
  BlacklistedToken,
  BlacklistedTokenSchema,
} from './schemas/blacklisted-token.schema';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '60m' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: BlacklistedToken.name, schema: BlacklistedTokenSchema },
    ]),
  ],
  providers: [AuthService, JwtStrategy, EmailService], // AuthService doit être là
  controllers: [AuthController],
})
export class AuthModule {}
