import { Controller, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get()
  async findAll() {
    try {
      const opportunities = await this.opportunitiesService.findAll();
      console.log('Opportunities returned from controller:', opportunities.length);
      return opportunities;
    } catch (error) {
      console.error('Error in controller:', error);
      throw new HttpException('Failed to retrieve opportunities', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const opportunity = await this.opportunitiesService.findOne(id);
      if (!opportunity) {
        throw new HttpException('Opportunity not found', HttpStatus.NOT_FOUND);
      }
      return opportunity;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to retrieve opportunity', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}