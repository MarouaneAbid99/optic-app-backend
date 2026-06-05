import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: OrderStatus, clientId?: number, page = 1, limit = 20) {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const where: any = {};
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { firstName: true, lastName: true } },
          _count: { select: { items: true, payments: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, total, page, limit: take };
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        client: { select: { firstName: true, lastName: true, phone: true } },
        items: { include: { product: { select: { name: true, type: true } } } },
        payments: { orderBy: { paidAt: 'desc' } },
        insuranceFiles: true,
      },
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return { ...order, remaining: order.totalAmount - order.paidAmount };
  }

  async create(dto: CreateOrderDto, userId: number) {
    const reference = await this.generateReference();
    const totalAmount = dto.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

    return this.prisma.order.create({
      data: {
        reference,
        clientId: dto.clientId,
        totalAmount,
        paidAmount: dto.paidAmount ?? 0,
        notes: dto.notes,
        deliveryAt: dto.deliveryAt ? new Date(dto.deliveryAt) : undefined,
        createdById: userId,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            label: item.label,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });
  }

  async update(id: number, dto: UpdateOrderDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.deliveryAt) data.deliveryAt = new Date(dto.deliveryAt);
    return this.prisma.order.update({ where: { id }, data });
  }

  private async generateReference(): Promise<string> {
    const last = await this.prisma.order.findFirst({ orderBy: { id: 'desc' } });
    const next = (last?.id ?? 0) + 1;
    return `CMD-${String(next).padStart(4, '0')}`;
  }
}
