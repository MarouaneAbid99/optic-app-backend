import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, page = 1, limit = 20) {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const where = search
      ? {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { phone: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.client.count({ where }),
    ]);

    return { data, total, page, limit: take };
  }

  async findOne(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        prescriptions: { orderBy: { date: 'desc' } },
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { _count: { select: { items: true } } },
        },
        insuranceFiles: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!client) throw new NotFoundException(`Client #${id} not found`);
    return client;
  }

  async create(dto: CreateClientDto) {
    return this.prisma.client.create({ data: dto });
  }

  async update(id: number, dto: UpdateClientDto) {
    await this.findOne(id);
    return this.prisma.client.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.client.delete({ where: { id } });
  }
}
