import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
    required: false,
  })
  lastname?: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'The CPF of the user',
    required: false,
  })
  cpf?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'The birth date of the user',
    required: false,
  })
  birthDate?: Date;

  @ApiProperty({
    type: [CreateAddressDto],
    description: 'List of addresses',
    required: false,
  })
  addresses?: CreateAddressDto[];
}
