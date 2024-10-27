import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @GrpcMethod('OrderService', 'GetById')
    findOne(data: { id: number }) {
      return this.orderService.order({ id: data.id });
    }
  
    @GrpcMethod('OrderService', 'GetAll')
    async findAll() {
      const order = await this.orderService.orders();
      return { order };
    }
}
