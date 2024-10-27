import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'Create')
  create(data: {
    email: string;
    name: string;
    username: string;
    password: string;
  }) {
    return this.userService.createUser(data);
  }

  @GrpcMethod('UserService', 'GetById')
  findOne(data: { id: number }) {
    return this.userService.user({ id: data.id });
  }

  @GrpcMethod('UserService', 'GetAll')
  async findAll() {
    const users = await this.userService.users({});
    return { users };
  }

  @GrpcMethod('UserService', 'Update')
  async update(data: {
    id: number;
    email?: string;
    name?: string;
    username?: string;
    password?: string;
  }) {
    const { id, ...updateData } = data;
    return await this.userService.updateUser({
      where: { id },
      data: updateData,
    });
  }

  @GrpcMethod('UserService', 'Delete')
  delete(data: { id: number }) {
    return this.userService.deleteUser({ id: data.id });
  }
}