import { EventBodyDTO } from '../../domain/dto/postEventDTO.dto';
import { AppModule } from '../../app.module';
import { AppService } from './app.service';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException, BadRequestException, MethodNotAllowedException } from '@nestjs/common';

describe('AppService - UnitTests', () => {
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
            origin: '1',
            amount: 10
        }
        expect(()=>{
            service.event(eventBody)
        }).toThrow(new BadRequestException('Invalid Type'));
    });

    it('event - valid type(deposit) - Should Create and Deposit in new Account', ()=>{
        const eventBody:EventBodyDTO = {
            type: 'deposit',
            destination: '100',
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

    it('deposit - non-existing account_id - Should Create and Deposit in new Account', ()=>{
        const eventBody:EventBodyDTO = {
            type: 'deposit',
            destination:'100',
            amount: 10
        };
        const expectedResult = {
            "destination": {
                "id": "100",
                "balance": 20
            }
        };
        const result = service.deposit(eventBody);
        expect(result).toEqual(expectedResult);
    });

    it('event - valid type(withdraw) - non-existing account_id - Should throw Not Found Exception', ()=>{
        const eventBody:EventBodyDTO = {
            type: 'withdraw',
            origin: '',
            amount: 10
        };
        expect(()=>{
            service.event(eventBody)
        }).toThrow(new NotFoundException('origin not found'));
    });

    it('event - valid type(withdraw) - Should withdraw 5 bucks from origin account', ()=>{
        const eventBody:EventBodyDTO = {
            type: 'withdraw',
            origin: '100',
            amount: 5
        };
        const updatedBalance = 15;
        const expectedResult = {
            origin:{
                id:eventBody.origin,
                balance:updatedBalance
            }
        }
        const result = service.event(eventBody);
        expect(result).toEqual(expectedResult);
    });

    it('event - valid type(transfer) - non-existing account_id - Should throw Not Found Exception', ()=>{
        const eventBody:EventBodyDTO = {
            type: 'transfer',
            origin: '200',
            amount: 15,
            destination:'300'
        };
        expect(()=>{
            service.event(eventBody)
        }).toThrow(new NotFoundException('origin not found'));
    });

    it('event - valid type(transfer) - Should send 15 bucks from origin to destination account', ()=>{
        const eventBody: EventBodyDTO = {
            type: 'transfer',
            origin:'100',
            amount: 15,
            destination:'300'
        };
        const originUpdatedBalance = 0;
        const destinationUpdatedBalance = 15;
        const expectedResult =  {
            origin:{
                id:eventBody.origin,
                balance:0
            },
            destination:{
                id:eventBody.destination,
                balance:destinationUpdatedBalance
            }
        }
        const result = service.transfer(eventBody);
        expect(result).toEqual(expectedResult);
    })
    
});
