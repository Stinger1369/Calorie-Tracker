import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.usersService.create(createUserDto);
    console.log('New user created:', newUser);
    return newUser;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();
    return users;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('fields') fields?: string, // Ajout de 'fields' en tant que paramètre de requête
  ): Promise<Partial<User>> {
    // Si des champs spécifiques sont demandés, les transmettre au service
    return this.usersService.findOne(id, fields ? fields.split(',') : null);
  }

  @Put(':id/bmi')
  async updateBMI(
    @Param('id') id: string,
    @Body('bmi') bmi: number,
  ): Promise<User> {
    const updatedUser = await this.usersService.updateBMI(id, bmi);
    return updatedUser;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Body('imageUrl') imageUrl: string, // Récupération de l'URL de l'image ici
  ): Promise<User> {
    console.log('--- Début de la mise à jour via le Controller ---');
    console.log('ID de l’utilisateur:', id);
    console.log('Données de mise à jour reçues:', updateUserDto);
    console.log('URL de l’image reçue dans le Controller:', imageUrl);

    const updatedUser = await this.usersService.update(
      id,
      updateUserDto,
      imageUrl,
    );

    console.log('Utilisateur mis à jour dans le Controller:', updatedUser);
    console.log('--- Fin de la mise à jour via le Controller ---');
    return updatedUser;
  }
  @UseGuards(AuthGuard('jwt'))
  @Put(':id/accept-policy')
  async acceptPolicy(
    @Param('id') id: string,
    @Body('hasAcceptedPolicy') hasAcceptedPolicy: boolean,
  ): Promise<User> {
    return this.usersService.updatePolicyAcceptance(id, hasAcceptedPolicy);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.delete(id);
  }
  @Post('google')
  async googleLogin(@Body('idToken') idToken: string) {
    try {
      const user =
        await this.usersService.findOrCreateUserByGoogleToken(idToken);
      return { user };
    } catch (error) {
      return { message: 'Erreur lors de la connexion avec Google', error };
    }
  }
}
