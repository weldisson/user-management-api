import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Address } from './user/entities/address.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const dataSource = new DataSource({
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          entities: [User, Address],
          synchronize: false,
        });

        await dataSource.initialize();
        await dataSource.query(
          `CREATE SCHEMA IF NOT EXISTS "${process.env.POSTGRES_USER_SCHEMA}"`,
        );
        await dataSource.destroy();

        return {
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          entities: [User, Address],
          schema: process.env.POSTGRES_USER_SCHEMA,
          synchronize: true,
        };
      },
    }),
    UserModule,
  ],
})
export class AppModule {}
