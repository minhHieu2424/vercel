import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';
import { OrderService} from './order/order.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { CartItemService } from './cart-item/cart-item.service';
import { CartItemModule } from './cart-item/cart-item.module';
@Module({
   imports: [ 

    ProductModule, PrismaModule, CategoryModule, CartModule, OrderModule, UserModule, CartItemModule],
  controllers: [AppController, ProductController, CartController, OrderController],
  providers: [AppService, ProductService, UserService, CartItemService ,OrderService],
})
export class AppModule { }
