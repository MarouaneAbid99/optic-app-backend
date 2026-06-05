import { Injectable, NotFoundException } from '@nestjs/common';
import { InsuranceStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInsuranceFileDto } from './dto/create-insurance-file.dto';
import { UpdateInsuranceFileDto } from './dto/update-insurance-file.dto';

@Injectable()
export class InsuranceService {
  constructor(private prisma: PrismaService) {}

  async findAll(clientId?: number, status?: InsuranceStatus, page = 1, limit = 20) {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.insuranceFile.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { firstName: true, lastName: true } },
          order: { select: { reference: true } },
        },
      }),
      this.prisma.insuranceFile.count({ where }),
    ]);

    return { data, total, page, limit: take };
  }

  async findOne(id: number) {
    const file = await this.prisma.insuranceFile.findUnique({
      where: { id },
      include: {
        client: { select: { firstName: true, lastName: true, phone: true } },
        order: { select: { reference: true, totalAmount: true, paidAmount: true } },
      },
    });
    if (!file) throw new NotFoundException(`Insurance file #${id} not found`);
    return file;
  }

  async create(dto: CreateInsuranceFileDto) {
    return this.prisma.insuranceFile.create({
      data: {
        ...dto,
        submittedAt: dto.submittedAt ? new Date(dto.submittedAt) : undefined,
      },
    });
  }

  async update(id: number, dto: UpdateInsuranceFileDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.submittedAt) data.submittedAt = new Date(dto.submittedAt);
    if (dto.reimbursedAt) data.reimbursedAt = new Date(dto.reimbursedAt);
    return this.prisma.insuranceFile.update({ where: { id }, data });
  }
}
