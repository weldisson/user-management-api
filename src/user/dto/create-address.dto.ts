import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({
    example: '123 Main St',
    description: 'The street of the address',
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    example: 'Apt 4B',
    description: 'The additional details of the address',
  })
  @IsString()
  @IsNotEmpty()
  additional: string;

  @ApiProperty({
    example: 'New York',
    description: 'The city of the address',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: 'NY',
    description: 'The state of the address',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    example: '10001',
    description: 'The zip code of the address',
  })
  @IsString()
  @IsNotEmpty()
  zip: string;
}
