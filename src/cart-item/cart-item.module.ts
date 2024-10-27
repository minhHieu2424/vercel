import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import {PrismaModule} from '../prisma/prisma.module'
import { CartService } from '../cart/cart.service';
import { OrderService} from '../order/order.service';
@Module({
  imports: [PrismaModule],
  providers: [CartItemService,CartService, OrderService ],
  controllers: [CartItemController],
  exports: [CartItemService]
})
export class CartItemModule {}
