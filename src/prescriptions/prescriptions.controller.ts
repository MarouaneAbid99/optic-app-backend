import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
export class PrescriptionsController {
  constructor(private prescriptions: PrescriptionsService) {}

  @Get()
  findByClient(
    @Query('clientId') clientId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.prescriptions.findByClient(+clientId, page ? +page : 1, limit ? +limit : 20);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptions.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePrescriptionDto) {
    return this.prescriptions.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePrescriptionDto) {
    return this.prescriptions.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptions.remove(id);
  }
}
