import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from './../src/user/dto/create-user.dto';
import { UpdateUserDto } from './../src/user/dto/update-user.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userId: number;
  const name: string = faker.string.fromCharacters('test', 5);
  const cpf: string = faker.string.numeric(11);
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user (POST) - should create a user', async () => {
    const createUserDto = {
      name: name,
      lastname: 'Doe',
      cpf: cpf,
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

    return request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .expect(201);
  });

  it(`/user?name=${name} (GET) - should find users by name`, async () => {
    return request(app.getHttpServer())
      .get('/user')
      .query({ name: name })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].name).toBe(name);
        userId = res.body[0].id;
      });
  });

  it(`/user?cpf=${cpf} (GET) - should find user by CPF`, async () => {
    return request(app.getHttpServer())
      .get('/user')
      .query({ cpf: cpf })
      .expect(200)
      .expect((res) => {
        expect(res.body.cpf).toBe(cpf);
      });
  });

  it('/user/:id (PATCH) - should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Alex',
    };

    return request(app.getHttpServer())
      .patch(`/user/${userId}`)
      .send(updateUserDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe('Alex');
      });
  });

  it('/user/:id (DELETE) - should delete a user', async () => {
    return request(app.getHttpServer())
      .delete(`/user/${userId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('User removed successfully');
      });
  });
});
