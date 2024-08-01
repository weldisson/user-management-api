import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let addressRepository: Repository<Address>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useClass: Repository },
        { provide: getRepositoryToken(Address), useClass: Repository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    addressRepository = module.get<Repository<Address>>(
      getRepositoryToken(Address),
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        name: 'John',
        lastname: 'Doe',
        cpf: '123.456.789-00',
        birthDate: '1990-01-01',
        addresses: [
          {
            street: '123 Main St',
            additional: 'Apt 4B',
            city: 'New York',
            state: 'NY',
            zip: '10001',
          },
        ],
      } as unknown as CreateUserDto;
      const userEntity = { ...createUserDto, id: 1 };

      jest.spyOn(userRepository, 'create').mockReturnValue(userEntity as any);
      jest
        .spyOn(addressRepository, 'create')
        .mockReturnValue(createUserDto.addresses[0] as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(userEntity as any);

      await userService.create(createUserDto);

      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(userEntity);
    });

    it('should throw an error if creation fails', async () => {
      const createUserDto = {
        name: 'John Doe',
        cpf: '12345678901',
      } as unknown as CreateUserDto;

      jest.spyOn(userRepository, 'create').mockImplementation(() => {
        throw new Error('Test error');
      });

      await expect(userService.create(createUserDto)).rejects.toThrow(Error);
    });
  });

  describe('findByName', () => {
    it('should find users by name successfully', async () => {
      const users = [
        { id: 1, name: 'John Doe', cpf: '12345678901', addresses: [] },
      ];

      jest.spyOn(userRepository, 'find').mockResolvedValue(users as any);

      const result = await userService.findByName('John Doe');

      expect(userRepository.find).toHaveBeenCalledWith({
        where: { name: 'John Doe' },
        relations: ['addresses'],
      });
      expect(result).toEqual(users);
    });

    it('should throw NotFoundException if no users found', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([]);

      await expect(userService.findByName('John Doe')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCpf', () => {
    it('should find user by CPF successfully', async () => {
      const user = { id: 1, name: 'John Doe', cpf: '12345678901' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any);

      const result = await userService.findByCpf('12345678901');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { cpf: '12345678901' },
      });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(userService.findByCpf('12345678901')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updateUserDto: UpdateUserDto = { name: 'John Doe Updated' };
      const userEntity = { id: 1, ...updateUserDto };

      jest
        .spyOn(userRepository, 'preload')
        .mockResolvedValue(userEntity as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(userEntity as any);

      const result = await userService.update(1, updateUserDto);

      expect(userRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateUserDto,
      });
      expect(userRepository.save).toHaveBeenCalledWith(userEntity);
      expect(result).toEqual(userEntity);
    });

    it('should throw NotFoundException if user not found for update', async () => {
      jest.spyOn(userRepository, 'preload').mockResolvedValue(null);

      await expect(
        userService.update(1, { name: 'John Doe Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove user successfully', async () => {
      jest
        .spyOn(userRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await userService.remove(1);

      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found for removal', async () => {
      jest
        .spyOn(userRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(userService.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
