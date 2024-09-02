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
    experiences?: { title: string; company: string; startDate: Date | string; endDate?: Date | string }[];
    education?: { degree: string; school: string; field: string; startDate: Date | string; endDate?: Date | string }[];
    interests?: string[];
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    try {
      return this.prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          skills: userData.skills ? { create: userData.skills.map(skill => ({ name: skill })) } : undefined,
          experiences: userData.experiences ? {
            create: userData.experiences.map(exp => ({
              title: exp.title,
              company: exp.company,
              startDate: new Date(exp.startDate),
              endDate: exp.endDate ? new Date(exp.endDate) : null,
            })),
          } : undefined,
          education: userData.education ? {
            create: userData.education.map(edu => ({
              degree: edu.degree,
              school: edu.school,
              field: edu.field,
              startDate: new Date(edu.startDate),
              endDate: edu.endDate ? new Date(edu.endDate) : null,
            })),
          } : undefined,
          interests: userData.interests ? { create: userData.interests.map(interest => ({ name: interest })) } : undefined,
        },
        include: {
          skills: true,
          experiences: true,
          education: true,
          interests: true,
        },
      });
    } catch (error) {
      console.error('Error while creating user:', error);
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
    skills?: string[];
    experiences?: { id?: number; title: string; company: string; startDate: Date | string; endDate?: Date | string }[];
    education?: { id?: number; degree: string; school: string; field: string; startDate: Date | string; endDate?: Date | string }[];
    interests?: string[];
  }) {
    const updateData: any = { 
      email: data.email,
      name: data.name
    };
    
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
  
    try {
      // Utilisation de connectOrCreate pour éviter les duplications
      if (data.skills) {
        updateData.skills = {
          deleteMany: {}, // Supprime toutes les anciennes compétences
          create: data.skills.map(skill => ({ name: skill })),
        };
      }
  
      if (data.experiences) {
        updateData.experiences = {
          deleteMany: {}, // Supprime toutes les anciennes expériences
          create: data.experiences.map(exp => ({
            title: exp.title,
            company: exp.company,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
          })),
        };
      }
  
      if (data.education) {
        updateData.education = {
          deleteMany: {}, // Supprime toutes les anciennes formations
          create: data.education.map(edu => ({
            degree: edu.degree,
            school: edu.school,
            field: edu.field,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
          })),
        };
      }
  
      if (data.interests) {
        updateData.interests = {
          deleteMany: {}, // Supprime tous les anciens intérêts
          create: data.interests.map(interest => ({ name: interest })),
        };
      }
  
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
      throw new BadRequestException('Failed to update user');
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
