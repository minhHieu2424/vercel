import { Injectable } from '@nestjs/common';
import { CartItem, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service'
@Injectable()
export class CartItemService {
  constructor(private prisma: PrismaService) { }
  async cartItem(
    cartItemWhereUniqueInput: Prisma.CartItemWhereUniqueInput,
  ): Promise<CartItem | null> {
    return this.prisma.cartItem.findUnique({
      where: cartItemWhereUniqueInput,
    });
  }

  async cartItems(): Promise<CartItem[]> {
    return this.prisma.cartItem.findMany();
  }
  async createCartItem(data: Prisma.CartItemCreateInput): Promise<CartItem> {
    return this.prisma.cartItem.create({
      data,
    });
  }

  async updatecartItem(params: {
    where: Prisma.CartItemWhereUniqueInput;
    data: Prisma.CartItemUpdateInput;
  }): Promise<CartItem> {
    const { where, data } = params;
    return this.prisma.cartItem.update({
      data,
      where,
    });
  }
  async deleteCartItem(where: Prisma.CartItemWhereUniqueInput): Promise<CartItem> {
    return this.prisma.cartItem.delete({
      where,
    });
  }
}
