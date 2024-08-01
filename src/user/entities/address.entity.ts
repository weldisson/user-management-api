import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity({ name: 'address', schema: process.env.POSTGRES_USER_SCHEMA })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '123 Main St',
    description: 'The street of the address',
  })
  @Column()
  street: string;

  @ApiProperty({
    example: 'Apt 4B',
    description: 'The additional details of the address',
  })
  @Column()
  additional: string;

  @ApiProperty({
    example: 'New York',
    description: 'The city of the address',
  })
  @Column()
  city: string;

  @ApiProperty({
    example: 'NY',
    description: 'The state of the address',
  })
  @Column()
  state: string;

  @ApiProperty({
    example: '10001',
    description: 'The zip code of the address',
  })
  @Column()
  zip: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user: User;
}
