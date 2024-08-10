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
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BlacklistedToken,
  BlacklistedTokenDocument,
} from './schemas/blacklisted-token.schema'; // Assurez-vous de créer ce schéma

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectModel(BlacklistedToken.name)
    private blacklistedTokenModel: Model<BlacklistedTokenDocument>, // Injectez le modèle de la liste noire
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const hashedPassword = this.hashPassword(registerDto.password);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Créer un nouvel utilisateur avec les informations de base
    const user = await this.usersService.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      password: hashedPassword,
      verificationCode: verificationCode,
      isVerified: false,
    });

    // Envoyer le code de vérification par email
    await this.emailService.sendVerificationCode(user.email, verificationCode);

    return { message: 'A verification code has been sent to your email.' };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: any }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user || !user.isVerified) {
      throw new UnauthorizedException('User is not verified.');
    }
    const payload = { email: user.email, sub: user._id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        // Inclure d'autres informations utilisateur si nécessaire
      },
    };
  }

  async verifyCode(email: string, code: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user || user.verificationCode !== code) {
      throw new UnauthorizedException('Invalid verification code.');
    }

    const currentTime = new Date().getTime();
    const codeExpirationTime = new Date(user.codeExpiration).getTime();

    if (currentTime > codeExpirationTime) {
      throw new UnauthorizedException('Verification code has expired.');
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.codeExpiration = null;
    await user.save();

    return { message: 'User successfully verified.' };
  }

  async sendNewVerificationCode(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newVerificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const codeExpirationTime = new Date(new Date().getTime() + 15 * 60000); // Code expires in 15 minutes

    user.verificationCode = newVerificationCode;
    user.codeExpiration = codeExpirationTime;
    await user.save();

    await this.emailService.sendVerificationCode(user.email, newVerificationCode);

    return { message: 'A new verification code has been sent to your email.' };
  }

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

  async findByEmail(email: string) {
    return this.usersService.findByEmail(email);
  }

  async logout(token: string): Promise<void> {
    // Ajoute le token à la liste noire
    await this.blacklistedTokenModel.create({ token });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const tokenInBlacklist = await this.blacklistedTokenModel.findOne({
      token,
    });
    return !!tokenInBlacklist;
  }
}
