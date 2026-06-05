import {
  Controller, Get, Post, Put,
  Body, Param, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { InsuranceStatus } from '@prisma/client';
import { InsuranceService } from './insurance.service';
import { CreateInsuranceFileDto } from './dto/create-insurance-file.dto';
import { UpdateInsuranceFileDto } from './dto/update-insurance-file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('insurance')
@UseGuards(JwtAuthGuard)
export class InsuranceController {
  constructor(private insurance: InsuranceService) {}

  @Get()
  findAll(
    @Query('clientId') clientId?: string,
    @Query('status') status?: InsuranceStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.insurance.findAll(
      clientId ? +clientId : undefined,
      status,
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.insurance.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateInsuranceFileDto) {
    return this.insurance.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInsuranceFileDto) {
    return this.insurance.update(id, dto);
  }
}
