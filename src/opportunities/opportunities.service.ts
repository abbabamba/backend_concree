import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OpportunitiesService {
  private readonly logger = new Logger(OpportunitiesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const opportunities = await this.prisma.opportunity.findMany();
      this.logger.log(`Found ${opportunities.length} opportunities`);
      return opportunities;
    } catch (error) {
      this.logger.error('Error fetching opportunities', error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const opportunity = await this.prisma.opportunity.findUnique({
        where: { id },
      });
      if (!opportunity) {
        throw new NotFoundException(`Opportunity with ID ${id} not found`);
      }
      return opportunity;
    } catch (error) {
      this.logger.error(`Error fetching opportunity with ID ${id}`, error.stack);
      throw error;
    }
  }
}