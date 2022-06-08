import { AppModule } from './../../app.module';
import { AppController } from './app.controller';
import { AppService } from './../services/app.service';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';


describe('AppController', () => {
  let app: INestApplication;
  let controller: AppController;
  let service: AppService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers:[AppController],
      providers:[AppService]
    }).compile();

    app = moduleFixture.createNestApplication();
    controller = moduleFixture.get<AppController>(AppController);
    service = moduleFixture.get<AppService>(AppService);
    await app.init();
  });

  it('GET /balance non-existing account - Should return 404', () => {
    return request(app.getHttpServer())
      .get('/balance?account_id=1234')
      .expect(HttpStatus.NOT_FOUND).expect('0');
  });

  it('GET /balance existing account - Should return account balance', () => {
    return request(app.getHttpServer())
      .get('/balance?account_id=1')
      .expect(HttpStatus.CREATED).expect('10');
  });

});


