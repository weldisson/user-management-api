import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto } from './create-address.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiProperty({
    example: '123 Main St',
    description: 'The street of the address',
    required: false,
  })
  street?: string;

  @ApiProperty({
    example: 'Apt 4B',
    description: 'The additional details of the address',
    required: false,
  })
  additional?: string;

  @ApiProperty({
    example: 'New York',
    description: 'The city of the address',
    required: false,
  })
  city?: string;

  @ApiProperty({
    example: 'NY',
    description: 'The state of the address',
    required: false,
  })
  state?: string;

  @ApiProperty({
    example: '10001',
    description: 'The zip code of the address',
    required: false,
  })
  zip?: string;
}
