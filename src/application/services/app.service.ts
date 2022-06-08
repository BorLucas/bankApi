import { EventBodyDTO } from './../../../dist/domain/dto/postEventDTO.dto.d';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AppService {
  private accounts = ['1','2','3','4','5'];
  private accountBalance = [
    {
      accountId:'1',
      balance:10
    },{
      accountId:'2',
      balance:10
    }
  ]
  findAccountBalanceById(accountId:string){
    if(!this.accounts.includes(accountId)){
      throw new NotFoundException('account_id not found');
    }
    return true;
  }

  createAccountWithDeposit(eventBody:EventBodyDTO){
    const validType = 'deposit';
    if(eventBody.type != validType){
      throw new BadRequestException('Invalid Type');
    }
    const objAccountBalance = {
      accountId: eventBody.destination,
      balance: eventBody.amount
    }
    this.accounts.push(eventBody.destination);
    this.accountBalance.push(objAccountBalance);
    const resultObject = {
      destination:{
        id:eventBody.destination,
        balance:eventBody.amount
      }
    }
    return resultObject;
  }
}
