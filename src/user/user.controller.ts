import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  Res,
  Logger,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    this.logger.log('POST /user called');
    try {
      await this.userService.create(createUserDto);
      this.logger.log('User created successfully');
      return res.status(HttpStatus.CREATED).send();
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      throw new BadRequestException(error.detail);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Search user by name or CPF' })
  @ApiResponse({
    status: 200,
    description: 'The found record(s)',
    type: [CreateUserDto],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'The name of the user',
    type: String,
  })
  @ApiQuery({
    name: 'cpf',
    required: false,
    description: 'The CPF of the user',
    type: String,
  })
  async find(
    @Res() res: Response,
    @Query('name') name?: string,
    @Query('cpf') cpf?: string,
  ) {
    this.logger.log('GET /user called');
    try {
      let result;
      if (cpf) {
        this.logger.log(`Searching user by CPF: ${cpf}`);
        result = await this.userService.findByCpf(cpf);
      } else if (name) {
        this.logger.log(`Searching user by name: ${name}`);
        result = await this.userService.findByName(name);
      } else {
        throw new BadRequestException('Please provide either name or CPF.');
      }
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      this.logger.error('Error finding user', error.stack);
      throw new NotFoundException(error.detail);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    this.logger.log(`PATCH /user/${id} called`);
    try {
      const user = await this.userService.update(+id, updateUserDto);
      this.logger.log(`User with ID ${id} updated successfully`);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      this.logger.error(`Error updating user with ID ${id}`, error.stack);
      throw new NotFoundException(error.detail);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User removed successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    this.logger.log(`DELETE /user/${id} called`);
    try {
      await this.userService.remove(+id);
      this.logger.log(`User with ID ${id} removed successfully`);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'User removed successfully' });
    } catch (error) {
      this.logger.error(`Error removing user with ID ${id}`, error.stack);
      throw new NotFoundException(error.detail);
    }
  }
}
