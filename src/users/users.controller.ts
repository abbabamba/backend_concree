import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Put,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { UserService } from './users.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: {
    email: string;
    password: string;
    name: string;
    skills?: string[];
    experiences?: { title: string; company: string; startDate: string; endDate?: string }[];
    education?: { degree: string; school: string; field: string; startDate: string; endDate?: string }[];
    interests?: string[];
  }) {
    const existingUser = await this.userService.findUserByEmail(body.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const user = await this.userService.createUser(body);
    return { message: 'User registered successfully', user };
  }

 

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.userService.validateUser(body.email, body.password);
    return { message: 'Login successful', user };
  }

  @Get('profile/:id')
  async getProfile(@Param('id', ParseIntPipe) userId: number) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return { user };
  }

 @Put('profile/:id')
async updateProfile(
  @Param('id', ParseIntPipe) userId: number,
  @Body() updateData: any,
) {
  try {
    console.log(`Attempting to update user ${userId} with data:`, JSON.stringify(updateData, null, 2));
    
    // Effectuer la mise à jour de l'utilisateur en appelant le service
    const updatedUser = await this.userService.updateUserProfile(userId, updateData);

    if (!updatedUser) {
      throw new BadRequestException(`User with ID ${userId} not found.`);
    }

    return { message: 'Profile updated successfully', user: updatedUser };
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    console.error('Stack trace:', error.stack);

    // Gestion des exceptions spécifiques
    if (error instanceof BadRequestException) {
      throw error;
    }

    // Gestion de toutes les autres exceptions
    throw new BadRequestException(
      `Failed to update user profile: ${error.message}`,
      {
        cause: error,
        description: 'An error occurred while updating the user profile. Please check the data format and try again.',
      },
    );
  }
}

}
