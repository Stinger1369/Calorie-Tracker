import {
  Controller,
  Post,
  Body,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    // Appel correct à la méthode forgotPassword de AuthService
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    const email = this.authService.verifyResetToken(token);
    const user = await this.authService.findByEmail(email); // Correction ici

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const hashedPassword = this.authService.hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    return { message: 'Password successfully reset' };
  }
}
