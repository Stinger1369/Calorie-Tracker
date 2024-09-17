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
} from './schemas/blacklisted-token.schema';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectModel(BlacklistedToken.name)
    private blacklistedTokenModel: Model<BlacklistedTokenDocument>,
  ) {
    this.client = new OAuth2Client(
      '159735607745-262ukrqbt3iqc7p6jvlhnemh97kg1vfl.apps.googleusercontent.com',
    );
  }
  // Authentification via Google
  async googleLogin(idToken: string): Promise<any> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience:
          '159735607745-262ukrqbt3iqc7p6jvlhnemh97kg1vfl.apps.googleusercontent.com',
      });
      const payload = ticket.getPayload();

      let user = await this.usersService.findByEmail(payload.email);

      if (!user) {
        user = await this.usersService.create({
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          googleId: payload.sub,
          isVerified: true,
        });
      }

      const access_token = this.generateAccessToken(user);
      const refresh_token = this.generateRefreshToken(user);

      return {
        access_token,
        refresh_token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }
  // Enregistrement d'un nouvel utilisateur
  async register(registerDto: RegisterDto): Promise<any> {
    const hashedPassword = this.hashPassword(registerDto.password);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const user = await this.usersService.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      password: hashedPassword,
      verificationCode: verificationCode,
      isVerified: false,
    });

    await this.emailService.sendVerificationCode(user.email, verificationCode);
    return { message: 'A verification code has been sent to your email.' };
  }

  // Connexion de l'utilisateur
  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string; user: any }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('User is not verified.');
    }

    const access_token = this.generateAccessToken(user);
    const refresh_token = this.generateRefreshToken(user);

    return {
      access_token,
      refresh_token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  // Générer un access token
  generateAccessToken(user: any): string {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  // Générer un refresh token
  generateRefreshToken(user: any): string {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  // Renouvellement de l'access token avec le refresh token
  async refreshAccessToken(
    refresh_token: string,
  ): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify(refresh_token);
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token.');
      }
      const newAccessToken = this.generateAccessToken(user);
      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Refresh token expired or invalid.');
    }
  }

  // Vérification du code de validation
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

  // Demander un nouveau code de vérification
  async sendNewVerificationCode(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newVerificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const codeExpirationTime = new Date(new Date().getTime() + 15 * 60000);

    user.verificationCode = newVerificationCode;
    user.codeExpiration = codeExpirationTime;
    await user.save();

    await this.emailService.sendVerificationCode(
      user.email,
      newVerificationCode,
    );

    return { message: 'A new verification code has been sent to your email.' };
  }

  // Gestion de la réinitialisation du mot de passe
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
    await this.blacklistedTokenModel.create({ token });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const tokenInBlacklist = await this.blacklistedTokenModel.findOne({
      token,
    });
    return !!tokenInBlacklist;
  }
}
