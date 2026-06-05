import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { InsuranceModule } from './insurance/insurance.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ClientsModule,
    PrescriptionsModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    InsuranceModule,
    DashboardModule,
  ],
})
export class AppModule {}
