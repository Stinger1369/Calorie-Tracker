import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify-code')
  async verifyCode(
    @Body('email') email: string,
    @Body('code') code: string,
  ): Promise<{ message: string }> {
    return this.authService.verifyCode(email, code);
  }

  @Post('request-new-code')
  async requestNewVerificationCode(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    return this.authService.sendNewVerificationCode(email);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    const email = this.authService.verifyResetToken(token);
    const user = await this.authService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const hashedPassword = this.authService.hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    return { message: 'Password successfully reset' };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization?.split(' ')[1]; // Récupère le token
    if (token) {
      await this.authService.logout(token); // Invalide le token
    }
    res.status(200).send({ message: 'Logged out successfully' });
  }
}
