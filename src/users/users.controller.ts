// users.controller.ts
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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: any) {
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
    const updatedUser = await this.userService.updateUser(userId, updateData);
    return { message: 'Profile updated successfully', user: updatedUser };
  }
}
