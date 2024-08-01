import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
    findByCpf: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return status 201', async () => {
      const createUserDto = {
        name: 'John',
        cpf: '12345678901',
        lastname: 'Doe',
        birthDate: '1990-01-01',
        addresses: [],
      } as unknown as CreateUserDto;
      await userController.create(createUserDto, mockResponse);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should throw BadRequestException on error', async () => {
      const createUserDto = {
        name: 'John',
        cpf: '12345678901',
        lastname: 'Doe',
        birthDate: '1990-01-01',
        addresses: [],
      } as unknown as CreateUserDto;
      mockUserService.create.mockRejectedValueOnce(new Error('Test error'));

      await expect(
        userController.create(createUserDto, mockResponse),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('find', () => {
    it('should find a user by CPF and return status 200', async () => {
      const user = { id: 1, name: 'John Doe', cpf: '12345678901' };
      mockUserService.findByCpf.mockResolvedValueOnce(user);

      await userController.find(mockResponse, undefined, '12345678901');

      expect(userService.findByCpf).toHaveBeenCalledWith('12345678901');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(user);
    });

    it('should find a user by name and return status 200', async () => {
      const user = { id: 1, name: 'John Doe', cpf: '12345678901' };
      mockUserService.findByName.mockResolvedValueOnce(user);

      await userController.find(mockResponse, 'John Doe', undefined);

      expect(userService.findByName).toHaveBeenCalledWith('John Doe');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException on error', async () => {
      mockUserService.findByCpf.mockRejectedValueOnce(new Error('Test error'));

      await expect(
        userController.find(mockResponse, undefined, '12345678901'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user and return status 200', async () => {
      const updateUserDto: UpdateUserDto = { name: 'John Doe Updated' };
      const updatedUser = {
        id: 1,
        name: 'John Doe Updated',
        cpf: '12345678901',
      };
      mockUserService.update.mockResolvedValueOnce(updatedUser);

      await userController.update('1', updateUserDto, mockResponse);

      expect(userService.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException on error', async () => {
      const updateUserDto: UpdateUserDto = { name: 'John Doe Updated' };
      mockUserService.update.mockRejectedValueOnce(new Error('Test error'));

      await expect(
        userController.update('1', updateUserDto, mockResponse),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user and return status 200', async () => {
      await userController.remove('1', mockResponse);

      expect(userService.remove).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User removed successfully',
      });
    });

    it('should throw NotFoundException on error', async () => {
      mockUserService.remove.mockRejectedValueOnce(new Error('Test error'));

      await expect(userController.remove('1', mockResponse)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
