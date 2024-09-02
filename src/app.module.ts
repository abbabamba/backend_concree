import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { PrismaService } from '../prisma/prisma.service';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { OpportunitiesService } from './opportunities/opportunities.service';
import { OpportunitiesController } from './opportunities/opportunities.controller';



@Module({
  imports: [UserModule , OpportunitiesModule],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService,PrismaService],
  exports: [PrismaService],
})
export class AppModule {}

