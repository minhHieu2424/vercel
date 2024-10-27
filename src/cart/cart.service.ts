import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cart, Prisma } from '@prisma/client';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async cart(params: {
        where: Prisma.CartWhereUniqueInput;
        include?: Prisma.CartInclude;
    }) {
        const { where, include } = params;
        return this.prisma.cart.findUnique({
            where,
            include: {
                cartItems: true,
                ...include,
            },
        });
    }

    async carts(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.CartWhereUniqueInput;
        where?: Prisma.CartWhereInput;
        orderBy?: Prisma.CartOrderByWithRelationInput;
        include?: Prisma.CartInclude;
    }): Promise<Cart[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.cart.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: {
                cartItems: true
            }
        });
    }

    async createCart(data: Prisma.CartCreateInput): Promise<Cart> {
        return this.prisma.cart.create({
            data,
            include: {
                cartItems: true
            }
        });
    }
    async updateCart(params: {
        where: Prisma.CartWhereUniqueInput;
        data: Prisma.CartUpdateInput;
    }): Promise<Cart> {
        const { where, data } = params;
        return this.prisma.cart.update({
            data,
            where,
            include: {
                cartItems: true
            }
        });
    }
    async deleteCart(where: Prisma.CartWhereUniqueInput): Promise<Cart> {
        return this.prisma.cart.delete({
            where
        });
    }
}