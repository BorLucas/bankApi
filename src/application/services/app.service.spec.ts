import { EventBodyDTO } from './../../domain/dto/postEventDTO.dto';
import { AppModule } from './../../app.module';
import { AppService } from './../services/app.service';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException, BadRequestException } from '@nestjs/common';
import * as request from 'supertest';


describe('AppController', () => {
  let app: INestApplication;
  let service: AppService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers:[AppService]
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<AppService>(AppService);
    await app.init();
  });

    it('findAccountBalanceById - non-existing ID - Should throw not found exception', ()=>{
        const accountId = '1234';
        expect(()=>{
            service.findAccountBalanceById(accountId)
        }).toThrowError(new NotFoundException('account_id not found'));
    });

    it('findAccountBalanceById - existing ID - Should return account balance', ()=>{
        const accountId = '1';
        const expectedResult = 10;
        const result = service.findAccountBalanceById(accountId);

        expect(result).toEqual(expectedResult);
    });

    it('event - invalid type - Should throw Bad Request Exception', ()=>{
        const eventBody:EventBodyDTO = {
            type: 'draw',
            destination: '1',
            amount: 10
        }
        expect(()=>{
            service.event(eventBody)
        }).toThrow(new BadRequestException('Invalid Type'));
    });

    it('event - valid type(deposit) - Should return depositResponseObject', ()=>{
        const eventBody:EventBodyDTO = {
            type: 'deposit',
            destination: '10',
            amount: 10
        };
        const expectedResult = {
            destination:{
                id:eventBody.destination,
                balance:eventBody.amount
            }
        }
        const result = service.event(eventBody);
        expect(result).toEqual(expectedResult);
    });


});
