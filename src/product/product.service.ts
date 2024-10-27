import { Injectable } from '@nestjs/common';
import { Product, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) { }

  async product(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput
  ): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: productWhereUniqueInput,
    });
  }

  async products(): Promise<Product[]> {
    return await this.prisma.product.findMany();
  }

  async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data: {
        ...data,
      },
    });
  }

  async updateProduct(params: {
    where: Prisma.ProductWhereUniqueInput;
    data: Prisma.ProductUpdateInput;
  }): Promise<Product> {
    const { where, data } = params;

    return await this.prisma.product.update({
      data,
      where,
    });

  }
  async deleteProduct(where: Prisma.ProductWhereUniqueInput): Promise<Product> {

    return await this.prisma.product.delete({
      where,
    });
  }
}