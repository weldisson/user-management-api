import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Address } from './address.entity';
import { Exclude, Expose, Type } from 'class-transformer';

@Entity({ name: 'user', schema: process.env.POSTGRES_USER_SCHEMA })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  @Column()
  @Index()
  name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @Column()
  lastname: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'The CPF of the user',
  })
  @Column({ unique: true })
  @Index()
  cpf: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'The birth date of the user',
  })
  @Column({ type: 'date' })
  birthDate: Date;

  @ApiProperty({ type: () => [Address], description: 'List of addresses' })
  @OneToMany(() => Address, (address: Address) => address.user, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  @Type(() => Address)
  @Expose()
  addresses: Address[];
}
