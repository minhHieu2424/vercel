import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CategoryService } from './category.service';


@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @GrpcMethod('CategoryService', 'Create')
  create(data: { name: string }) {
    return this.categoryService.createCategory(data);
  }

  @GrpcMethod('CategoryService', 'FindOne')
  findOne(data: { id: number }) {
    return this.categoryService.category({
      id: data.id,
    });
  }

  @GrpcMethod('CategoryService', 'FindAll')
  async findAll() {
    const categories = await this.categoryService.categories();
    return { categories };
  }
  

}