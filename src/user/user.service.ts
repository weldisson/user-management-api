import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Address } from './entities/address.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    try {
      this.logger.log('Creating a new user');

      const user = this.userRepository.create(createUserDto);

      if (user.addresses) {
        user.addresses = user.addresses.map((address) =>
          this.addressRepository.create(address),
        );
        user.addresses.forEach((address) => (address.user = user));
      }

      const savedUser = await this.userRepository.save(user);
      this.logger.log(`User created with ID: ${savedUser.id}`);
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      throw error;
    }
  }

  async findByName(name: string): Promise<User[]> {
    try {
      this.logger.log(`Finding users by name: ${name}`);
      const users = await this.userRepository.find({
        where: { name },
        relations: ['addresses'],
      });
      if (users.length === 0) {
        this.logger.warn('No users found with the given name');
        throw new NotFoundException('No users found with the given name.');
      }
      this.logger.log(`Found ${users.length} users with the name: ${name}`);
      return users;
    } catch (error) {
      this.logger.error('Error finding users by name', error.stack);
      throw error;
    }
  }

  async findByCpf(cpf: string): Promise<User> {
    this.logger.log(`Finding user by CPF: ${cpf}`);
    try {
      const user = await this.userRepository.findOne({ where: { cpf } });
      if (!user) {
        this.logger.warn('User not found with the given CPF');
        throw new NotFoundException('User not found with the given CPF.');
      }
      this.logger.log(`User found with CPF: ${cpf}`);
      return user;
    } catch (error) {
      this.logger.error('Error finding user by CPF', error.stack);
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      this.logger.log(`Updating user with ID: ${id}`);
      const user = await this.userRepository.preload({
        id,
        ...updateUserDto,
      });

      if (!user) {
        this.logger.warn('User not found for update');
        throw new NotFoundException('User not found.');
      }

      const updatedUser = await this.userRepository.save(user);
      return plainToClass(User, updatedUser, {
        excludeExtraneousValues: false,
      });
    } catch (error) {
      this.logger.error('Error updating user', error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing user with ID: ${id}`);
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn('User not found for removal');
        throw new NotFoundException('User not found.');
      }
      this.logger.log(`User removed with ID: ${id}`);
    } catch (error) {
      this.logger.error('Error removing user', error.stack);
      throw error;
    }
  }
}
