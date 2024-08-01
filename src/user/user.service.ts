import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Address } from './entities/address.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);

    if (user.addresses) {
      user.addresses = user.addresses.map((address) =>
        this.addressRepository.create(address),
      );
      user.addresses.forEach((address) => (address.user = user));
    }

    const savedUser = await this.userRepository.save(user);
    return plainToClass(User, savedUser, { excludeExtraneousValues: true });
  }

  async findByName(name: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { name },
      relations: ['addresses'],
    });
    if (users.length === 0) {
      throw new NotFoundException('No users found with the given name.');
    }
    return users;
  }

  async findByCpf(cpf: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { cpf },
      relations: ['addresses'],
    });
    if (!user) {
      throw new NotFoundException('User not found with the given CPF.');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses'],
    });

    if (updateUserDto.addresses) {
      await this.addressRepository.remove(user.addresses);
      user.addresses = updateUserDto.addresses.map((address) =>
        this.addressRepository.create(address),
      );
      user.addresses.forEach((address) => (address.user = user));
    }

    Object.assign(user, updateUserDto);

    const updatedUser = await this.userRepository.save(user);
    return plainToClass(User, updatedUser, { excludeExtraneousValues: true });
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses'],
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await this.userRepository.remove(user);
  }
}
