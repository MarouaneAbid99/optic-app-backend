import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException(`Order #${dto.orderId} not found`);

    const [payment] = await this.prisma.$transaction([
      this.prisma.payment.create({
        data: {
          orderId: dto.orderId,
          amount: dto.amount,
          method: dto.method,
          paidAt: dto.paidAt ? new Date(dto.paidAt) : new Date(),
        },
      }),
      this.prisma.order.update({
        where: { id: dto.orderId },
        data: { paidAmount: { increment: dto.amount } },
      }),
    ]);

    return payment;
  }

  async findByOrder(orderId: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Order #${orderId} not found`);

    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { paidAt: 'desc' },
    });
  }
}
