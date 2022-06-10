import { BalanceDTO } from './../../domain/dto/getBalanceDTO.dto';
import { EventBodyDTO } from './../../domain/dto/postEventDTO.dto';
import { BadRequestException, Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';

@Injectable()
export class AppService {
  public accounts = ['1','2','300'];
  public accountBalance = [
    {
      accountId:'1',
      balance:10
    },
    {
      accountId:'2',
      balance:10
    },
    {
      accountId:'300',
      balance:0
    }
  ];

  findAccountBalanceById(accountId:string){
    const account = this.existsAccount(accountId);
    if(!account){
      throw new NotFoundException('account_id not found');
    }
    return account.balance;
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
    let account = this.existsAccount(destination);
    if(!account){
      this.createAccount(destination);
    }
    const resultObject = this.depositAccount(destination, amount);
    return resultObject;
  }
  
  withdraw(eventBody:EventBodyDTO){
    const {origin, amount} = eventBody;
    let account = this.existsAccount(origin);
    if(!account){
      throw new NotFoundException('origin not found');
    }
    const resultObject = this.withdrawAccount(origin, amount);
    return resultObject
 
  }

  transfer(eventBody:EventBodyDTO){
    const {destination, origin, amount} = eventBody;
    if(!this.existsAccount(origin)){
      throw new NotFoundException('origin not found');
    }
    const withdrawResult = this.withdrawAccount(origin, amount);
    const depositResult = this.depositAccount(destination, amount);
    const transferResult = this.transferResultFactory(withdrawResult, depositResult);
      
    return transferResult;
  }

  depositAccount(accountId:string, amount:number){
    const foundAccount = this.existsAccount(accountId);
    if(!foundAccount){
      throw new NotFoundException('destination not found');
    }
      foundAccount.balance += amount;
      const resultObject = {
        destination:{
          id:accountId,
          balance:foundAccount.balance
        }
      }
      return resultObject; 
  }

  withdrawAccount(accountId:string, amount:number){
    const foundAccount = this.existsAccount(accountId);
    if(!foundAccount){
      throw new NotFoundException('origin not found');
    }
    foundAccount.balance -= amount;
    const resultObject = {
      origin:{
        id:accountId,
        balance:foundAccount.balance
      }
    }
    return resultObject;
  }

  existsAccount(accountId:string){
    if(!this.accounts.includes(accountId)){
      return false;
    }
    const account = this.accountBalance.find(
      (element) => element.accountId == accountId,
    );
    return account;
  }

  createAccount(accountId:string){
    const objAccountBalance = {
      accountId:accountId,
      balance:0
    }
    this.accounts.push(accountId);
    this.accountBalance.push(objAccountBalance);
  }

  transferResultFactory(withdrawResult:any, depositResult:any){
    return  {
      origin:{
        id: withdrawResult.origin.id,
        balance:withdrawResult.origin.balance
      },
      destination:{
        id:depositResult.destination.id,
        balance:depositResult.destination.balance
      }
    }
  }
  reset(){
    this.accounts = ['1','2','300'];
    this.accountBalance = [
      {
        accountId:'1',
        balance:10
      },
      {
        accountId:'2',
        balance:10
      },
      {
        accountId:'300',
        balance:0
      }
    ];
  }
}