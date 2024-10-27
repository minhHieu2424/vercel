import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: ['product', 'category', 'cart','user','order','car_items'],
      protoPath: [
        join(__dirname, 'proto/product.proto'),  
        join(__dirname, 'proto/category.proto'),
        join(__dirname, 'proto/cart.proto'),
        join(__dirname, 'proto/user.proto'),
        join(__dirname, 'proto/order.proto'),
        join(__dirname, 'proto/cart-item.proto'),
      ],
      url: 'localhost:50051',
        },
  });

  await app.listen();
}
bootstrap();