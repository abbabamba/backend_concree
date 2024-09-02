// src/prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporter PrismaService pour qu'il puisse être utilisé dans d'autres modules
})
export class PrismaModule {}
