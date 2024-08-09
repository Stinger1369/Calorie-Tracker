import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.generateResetToken(user.email);
    await this.emailService.sendResetPasswordEmail(user.email, token);

    return { message: 'Password reset link has been sent to your email.' };
  }

  generateResetToken(email: string): string {
    return this.jwtService.sign({ email }, { expiresIn: '1h' });
  }

  verifyResetToken(token: string): string {
    const payload = this.jwtService.verify(token);
    return payload.email;
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 8);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const hashedPassword = this.hashPassword(registerDto.password);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    const { password, ...result } = user.toObject();
    return result;
  }

  // Ajoutez ici la méthode findByEmail dans AuthService si nécessaire
  async findByEmail(email: string) {
    return this.usersService.findByEmail(email);
  }
}
