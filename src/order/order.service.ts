import { Injectable } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import {PrismaService} from '../prisma/prisma.service'

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    async order(
        orderWhereUniqueInput: Prisma.OrderWhereUniqueInput,
    ): Promise<Order | null> {
      return this.prisma.order.findUnique({
        where: orderWhereUniqueInput,
      });
    }
  
    async orders(): Promise<Order[]> {
      return this.prisma.order.findMany()
    }
  
    async createOrder(data: Prisma.OrderCreateInput): Promise<Order> {
      return this.prisma.order.create({
        data,
      });
    }
    async deleteOrder(where: Prisma.OrderWhereUniqueInput): Promise<Order> {
      return this.prisma.order.delete({
        where,
      });
    }
}
