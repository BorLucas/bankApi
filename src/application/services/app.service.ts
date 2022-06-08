import { EventBodyDTO } from './../../domain/dto/postEventDTO.dto';
import { BadRequestException, Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';

@Injectable()
export class AppService {
  private accounts = ['1','2','3','4','5'];
  private accountBalance = [
    {
      accountId:'1',
      balance:10
    },
    {
      accountId:'2',
      balance:10
    }
  ];

  findAccountBalanceById(accountId:string){
    if(!this.accounts.includes(accountId)){
      throw new NotFoundException('account_id not found');
    }
    return 10;
    //Pegar codigo que faz essa validação com objetos.(Filter?)
  }

  event (eventBody:EventBodyDTO){
    const validTypes = ['deposit', 'withdraw', 'transfer'];
    if(!validTypes.includes(eventBody.type)){
      throw new BadRequestException('Invalid Type');
    }
    switch(eventBody.type){
      case 'deposit':
        return this.deposit(eventBody);
      case 'withdraw':
        return this.withdraw(eventBody);
      case 'transfer':
        return this.transfer(eventBody);
    }
  }

  deposit(eventBody:EventBodyDTO){
    const {destination, amount} = eventBody;
    if(!this.existsAccount(destination)){
      this.createAccountWithDeposit(destination, amount)
    }
    this.depositAccounById(destination, amount);
    const resultObject = {
      destination:{
        id:destination,
        balance:amount
      }
    }
    return resultObject;
  }

  withdraw(eventBody:EventBodyDTO){
    throw new MethodNotAllowedException('method not implemented');
  }

  transfer(eventBody:EventBodyDTO){
    throw new MethodNotAllowedException('method not implemented');
  }

  createAccountWithDeposit(accountId:string, amount:number){
    this.accounts.push(accountId);
    this.depositAccounById(accountId, amount)
  }

  depositAccounById(accountId:string, amount:number){
    const objAccountBalance = {
      accountId: accountId,
      balance: amount
    }    
    this.accountBalance.push(objAccountBalance);
  }

  existsAccount(accountId:string){
    if(this.accounts.includes(accountId)){
      return true
    }
    return false;
  }
}
