import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService', 'Create')
  create(data: {
    name: string;
    price: number;
    stock: number;
    description: string;
    categoryId: number;
  }) {
    return this.productService.createProduct(data);
  }

  @GrpcMethod('ProductService', 'GetById')
  findOne(data: { id: number }) {
    return this.productService.product({id :data.id});
  }

  @GrpcMethod('ProductService', 'GetAll')
  async findAll() {
    const products = await this.productService.products();
    return {products}
  }

  @GrpcMethod('ProductService', 'Update')
  async update(data: {
    id: number;
    name?: string;
    price?: number;
    stock?: number;
    description?: string;
    categoryId?: number;
  }) {
    const { id, ...updateData } = data;
    return await this.productService.updateProduct({
      where: { id },
      data: updateData,
    });
  }


  @GrpcMethod('ProductService', 'Delete')
  delete(data: { id: number }) {
    return this.productService.deleteProduct({id: data.id});
  }
}