import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(type?: ProductType, supplierId?: number, page = 1, limit = 20) {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const where: any = {};
    if (type) where.type = type;
    if (supplierId) where.supplierId = supplierId;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { supplier: { select: { name: true } } },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total, page, limit: take };
  }

  async findOne(id: number) {
    const p = await this.prisma.product.findUnique({
      where: { id },
      include: { supplier: { select: { id: true, name: true, phone: true } } },
    });
    if (!p) throw new NotFoundException(`Product #${id} not found`);
    return p;
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async getLowStock() {
    return this.prisma.$queryRaw<any[]>`
      SELECT id, type, name, brand, stockQuantity, minStock, sellPrice
      FROM Product
      WHERE stockQuantity < minStock
      ORDER BY stockQuantity ASC
    `;
  }
}
