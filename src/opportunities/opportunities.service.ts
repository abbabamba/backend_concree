import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to get all opportunities
  async findAll() {
    const opportunities = await this.prisma.opportunity.findMany();
    console.log('Opportunities found:', opportunities.length);
    return opportunities;
  }

  // Method to get a specific opportunity by ID
  async findOne(id: number) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
      // Removed the include for applications since it no longer exists
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunité non trouvée');
    }

    return opportunity;
  }
}
