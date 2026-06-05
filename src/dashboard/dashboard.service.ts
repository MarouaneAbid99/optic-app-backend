import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalRevenueResult,
      ordersCount,
      openOrders,
      clientsCount,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      this.prisma.payment.aggregate({ _sum: { amount: true } }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.EN_COURS } }),
      this.prisma.client.count(),
      this.prisma.$queryRaw<any[]>`
        SELECT id, name, type, brand, stockQuantity, minStock
        FROM Product
        WHERE stockQuantity < minStock
        ORDER BY stockQuantity ASC
      `,
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { firstName: true, lastName: true } },
        },
      }),
    ]);

    return {
      totalRevenue: totalRevenueResult._sum.amount ?? 0,
      ordersCount,
      openOrders,
      clientsCount,
      lowStockProducts,
      recentOrders,
    };
  }
}
