// users.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Création d'un nouvel utilisateur avec tous les champs
  async createUser(userData: {
    email: string;
    password: string;
    name: string;
    skills?: string[];
    experiences?: { title: string; company: string; startDate: string; endDate?: string }[];
    education?: { degree: string; school: string; field: string; startDate: string; endDate?: string }[];
    interests?: string[];
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
  
    try {
      return await this.prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          skills: userData.skills ? {
            create: userData.skills.map(name => ({ name }))
          } : undefined,
          experiences: userData.experiences ? {
            create: userData.experiences.map(exp => ({
              title: exp.title,
              company: exp.company,
              startDate: new Date(exp.startDate),
              endDate: exp.endDate ? new Date(exp.endDate) : null,
            }))
          } : undefined,
          education: userData.education ? {
            create: userData.education.map(edu => ({
              degree: edu.degree,
              school: edu.school,
              field: edu.field,
              startDate: new Date(edu.startDate),
              endDate: edu.endDate ? new Date(edu.endDate) : null,
            }))
          } : undefined,
          interests: userData.interests ? {
            create: userData.interests.map(name => ({ name }))
          } : undefined,
        },
        include: {
          skills: true,
          experiences: true,
          education: true,
          interests: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  // Recherche d'un utilisateur par email
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        skills: true,
        experiences: true,
        education: true,
        interests: true,
      },
    });
  }

  // Recherche d'un utilisateur par ID
  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        skills: true,
        experiences: true,
        education: true,
        interests: true,
      },
    });
  }

  // Mise à jour du profil utilisateur
  async updateUser(id: number, data: {
    email?: string;
    name?: string;
    password?: string;
    skills?: Array<{ id?: number; name: string; userId?: number }>;
    experiences?: Array<{ id?: number; title: string; company: string; startDate: Date | string; endDate?: Date | string }>;
    education?: Array<{ id?: number; degree: string; school: string; field: string; startDate: Date | string; endDate?: Date | string }>;
    interests?: Array<{ id?: number; name: string; userId?: number }>;
  }) {
    const updateData: any = {};
    
    if (data.email) updateData.email = data.email;
    if (data.name) updateData.name = data.name;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
  
    try {
      if (Array.isArray(data.skills) && data.skills.length > 0) {
        updateData.skills = {
          deleteMany: {},
          create: data.skills.map(skill => ({ name: skill.name })),
        };
      }
  
      if (Array.isArray(data.experiences) && data.experiences.length > 0) {
        updateData.experiences = {
          deleteMany: {},
          create: data.experiences.map(exp => ({
            title: exp.title,
            company: exp.company,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
          })),
        };
      }
  
      if (Array.isArray(data.education) && data.education.length > 0) {
        updateData.education = {
          deleteMany: {},
          create: data.education.map(edu => ({
            degree: edu.degree,
            school: edu.school,
            field: edu.field,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
          })),
        };
      }
  
      if (Array.isArray(data.interests) && data.interests.length > 0) {
        updateData.interests = {
          deleteMany: {},
          create: data.interests.map(interest => ({ name: interest.name })),
        };
      }
  
      console.log('Updating user with data:', JSON.stringify(updateData, null, 2));
  
      return await this.prisma.user.update({
        where: { id },
        data: updateData,
        include: {
          skills: true,
          experiences: true,
          education: true,
          interests: true,
        },
      });
    } catch (error) {
      console.error('Error while updating user:', error);
      throw new BadRequestException(`Failed to update user: ${error.message}`);
    }
  }

  
  

  // Méthode pour valider les informations de connexion
  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    return user;
  }
}
