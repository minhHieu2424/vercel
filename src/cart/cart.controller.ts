import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { Cart, Prisma } from '@prisma/client';
import { ProductService } from '../product/product.service';
import { CartItemService } from '../cart-item/cart-item.service';

@Controller()
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
    private readonly cartItemService: CartItemService,
  ) {}

  @GrpcMethod('CartService', 'GetAll')
  async getAllCarts() {
    const carts = await this.cartService.carts({});
    return { carts };
  }

  @GrpcMethod('CartService', 'GetById')
  async getCartById(data: { id: number }) {
    const cart = await this.cartService.cart({
      where: { id: data.id },
    });
    
    if (!cart) {
      return { message: 'Giỏ hàng không tồn tại' };
    }
    
    return { cart};
  }

  @GrpcMethod('CartService', 'Create')
  async createCart(data: { userId: number; quantity: number; productId: number }) {
    const product = await this.productService.product({ id: data.productId });
    
    if (!product) {
      return { message: 'Sản phẩm không tồn tại' };
    }
    
    if (data.quantity > product.stock) {
      return { message: 'Số lượng sản phẩm không đủ' };
    }
    
    if (data.quantity <= 0) {
      return { message: 'Số lượng sản phẩm không được bé hơn 0' };
    }

    const cart = await this.cartService.createCart({
      totalItems: data.quantity,
      totalPrice: product.price * data.quantity,
      status: 'CTT',
      user: {
        connect: { id: data.userId },
      },
      cartItems: {
        create: {
          quantity: data.quantity,
          product: {
            connect: { id: data.productId },
          },
        },
      },
    });

    return { cart};
  }

  @GrpcMethod('CartService', 'Add')
  async addProductToCart(data: { cartId: number; productId: number; quantity: number }) {
    const existingCart = await this.cartService.cart({
      where: { id: data.cartId },
      include: { cartItems: true },
    });

    if (!existingCart || existingCart.status !== 'CTT') {
      return { message: 'Giỏ hàng không tồn tại hoặc đã được thanh toán' };
    }

    const product = await this.productService.product({ id: data.productId });
    
    if (!product) {
      return { message: 'Sản phẩm không tồn tại' };
    }
    
    if (data.quantity > product.stock) {
      return { message: 'Số lượng sản phẩm không đủ' };
    }
    
    if (data.quantity <= 0) {
      return { message: 'Số lượng sản phẩm không được bé hơn 0' };
    }

    const existingCartItem = existingCart.cartItems.find(
      item => item.productId === data.productId
    );

    let updatedCart
    if (existingCartItem) {
      await this.cartItemService.updatecartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + data.quantity },
      });

       updatedCart = await this.cartService.updateCart({
        where: { id: data.cartId },
        data: {
          totalItems: existingCart.totalItems + data.quantity,
          totalPrice: existingCart.totalPrice + (product.price * data.quantity),
        },
      });
    } else {
      updatedCart = await this.cartService.updateCart({
        where: { id: data.cartId },
        data: {
          totalItems: existingCart.totalItems + data.quantity,
          totalPrice: existingCart.totalPrice + (product.price * data.quantity),
          cartItems: {
            create: {
              quantity: data.quantity,
              product: {
                connect: { id: data.productId },
              },
            },
          },
        },
      });
    }

    return { cart: updatedCart };
  }

  @GrpcMethod('CartService', 'Update')
  async updateProductInCart(data: { cartId: number; productId: number; quantity: number }) {
    const existingCart = await this.cartService.cart({
      where: { id: data.cartId },
      include: { cartItems: true },
    });

    if (!existingCart || existingCart.status !== 'CTT') {
      return { message: 'Giỏ hàng không tồn tại hoặc đã được thanh toán' };
    }
    const product = await this.productService.product({ id: data.productId });
    if (!product) {
      return { message: 'Sản phẩm không tồn tại' };
    }

    if (data.quantity > product.stock) {
      return { message: 'Số lượng sản phẩm không đủ' };
    }

    const existingCartItem = existingCart.cartItems.find(
      item => item.productId === data.productId
    );
    // níu mà nhập một id sản  phẩm khác chưa tồn tại trong giỏ hàng thì thêm sản phẩm đó vào giỏ
    if (!existingCartItem) {
      if (data.quantity <= 0) {
        return { message: 'Số lượng sản phẩm không được bé hơn 0' };
      }
      const updatedCart = await this.cartService.updateCart({
        where: { id: data.cartId },
        data: {
          totalItems: existingCart.totalItems + data.quantity,
          totalPrice: existingCart.totalPrice + (product.price * data.quantity),
          cartItems: {
            create: {
              quantity: data.quantity,
              product: {
                connect: { id: data.productId },
              },
            },
          },
        },
      });
      return { cart: updatedCart, message: `Đã thêm sản phẩm ${product.name} với số lượng: ${data.quantity}` };
    }
    if (data.quantity <= 0) {
      // nếu mà nhập cái số lượng của sản phẩm đó nhỏ hơn 0 thì xóa giỏ hàng
      // tại chưa biết sử lý sao cho hợp lý nếu người dùng muốn xóa sản phẩm đó ra khỏi giỏ hàng
      await this.cartItemService.deleteCartItem({ id: existingCartItem.id });
          // nếu mà không còn sản phẩm nào trong giỏ thì xóa tổng số và tổng tiền trả về 0
      if (existingCart.cartItems.length === 1) {
        const updatedCart = await this.cartService.updateCart({
          where: { id: data.cartId },
          data: {
            totalItems: 0,
            totalPrice: 0,
          },
        });
        return { cart: updatedCart, message: 'Không còn sản phẩm nào trong giỏ hàng' };
      } else {
        const updatedCart = await this.cartService.updateCart({
          where: { id: data.cartId },
          data: {
            totalItems: existingCart.totalItems - existingCartItem.quantity,
            totalPrice: existingCart.totalPrice - (existingCartItem.quantity * product.price),
          },
        });
        return { cart: updatedCart, message: 'Sản phẩm đã bị xóa khỏi giỏ hàng' };
      }
    }

    const quantityDiff = data.quantity - existingCartItem.quantity;
    const updatedCart = await this.cartService.updateCart({
      where: { id: data.cartId },
      data: {
        totalItems: existingCart.totalItems + quantityDiff,
        totalPrice: existingCart.totalPrice + (product.price * quantityDiff),
        cartItems: {
          update: {
            where: { id: existingCartItem.id },
            data: { quantity: data.quantity },
          },
        },
      },
    });

    return { 
      cart: updatedCart, 
      message: `Sản phẩm ${product.name} số lượng cũ ${existingCartItem.quantity} số lượng mới: ${data.quantity}` 
    };
  }

  @GrpcMethod('CartService', 'Buy')
  async buyCart(data: { cartId: number; status: string }) {
    const existingCart = await this.cartService.cart({
      where: { id: data.cartId },
      include: {
        cartItems: {
          include: {
            product: true
          }
        }
      }
    });
    if (!existingCart) {
      return { message: 'Giỏ hàng không tồn tại' };
    }

    if (existingCart.status === 'SUCCESS') {
      return { message: 'Giỏ hàng này đã được thanh toán' };
    }

    if (data.status !== 'SUCCESS') {
      return { message: 'Trạng thái đơn hàng không hợp lệ' };
    }

    const stockItems = [];
    for (const cartItem of existingCart.cartItems) {
      const product = await this.productService.product({ id: cartItem.productId });
      if (cartItem.quantity > product.stock) {
        stockItems.push({
          name: product.name,
          quantity: cartItem.quantity,
          stock: product.stock
        });
      }
    }

    if (stockItems.length > 0) {
      const message = stockItems.map(item =>
        `Sản phẩm "${item.name}": Yêu cầu ${item.quantity}, chỉ còn ${item.stock} trong kho.`
      ).join('\n');
      return { message: `Không đủ hàng trong kho:\n${message}` };
    }

    await this.prisma.order.create({
      data: {
        totalItems: existingCart.totalItems,
        totalPrice: existingCart.totalPrice,
        status: 'PENDING',
        user: {
          connect: { id: existingCart.userId },
        },
        orderItems: {
          create: existingCart.cartItems.map(item => ({
            quantity: item.quantity,
            product: {
              connect: { id: item.productId },
            },
          })),
        },
      },
    });

    for (const cartItem of existingCart.cartItems) {
      await this.productService.updateProduct({
        where: { id: cartItem.productId },
        data: {
          stock: {
            decrement: cartItem.quantity
          }
        }
      });
    }

    const updatedCart = await this.cartService.updateCart({
      where: { id: data.cartId },
      data: {
        totalItems: 0,
        totalPrice: 0,
        status: 'CTT'
      }
    });

    return { cart: updatedCart, message: 'Mua hàng thành công' };
  }

  @GrpcMethod('CartService', 'Delete')
  async deleteCart(data: { id: number }) {
    const cart = await this.cartService.cart({
      where: { id: data.id },
      include: { cartItems: true }
    });

    if (!cart) {
      return { message: 'Giỏ hàng không tồn tại' };
    }

    if (cart.cartItems.length > 0) {
      return { message: 'Không thể xóa giỏ hàng còn sản phẩm' };
    }

    await this.cartService.deleteCart({ id: data.id });
    return { message: 'Giỏ hàng đã được xóa' };
  }
}