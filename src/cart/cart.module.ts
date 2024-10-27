import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import {PrismaModule} from '../prisma/prisma.module'
import{ ProductService} from '../product/product.service'
import{ OrderService} from '../order/order.service'
import { CartItemService } from '../cart-item/cart-item.service';
@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [CartService , OrderService, CartItemService,ProductService],
  exports: [CartService]
})
export class CartModule {}
