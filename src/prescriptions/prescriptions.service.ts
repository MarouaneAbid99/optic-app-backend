import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

  async findByClient(clientId: number, page = 1, limit = 20) {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const [data, total] = await Promise.all([
      this.prisma.prescription.findMany({
        where: { clientId },
        skip,
        take,
        orderBy: { date: 'desc' },
        include: { client: { select: { firstName: true, lastName: true } } },
      }),
      this.prisma.prescription.count({ where: { clientId } }),
    ]);

    return { data, total, page, limit: take };
  }

  async findOne(id: number) {
    const p = await this.prisma.prescription.findUnique({
      where: { id },
      include: { client: { select: { firstName: true, lastName: true } } },
    });
    if (!p) throw new NotFoundException(`Prescription #${id} not found`);
    return p;
  }

  async create(dto: CreatePrescriptionDto) {
    return this.prisma.prescription.create({ data: { ...dto, date: new Date(dto.date) } });
  }

  async update(id: number, dto: UpdatePrescriptionDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    return this.prisma.prescription.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.prescription.delete({ where: { id } });
  }
}
