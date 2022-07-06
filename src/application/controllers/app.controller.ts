import { EventBodyDTO } from './../../domain/dto/postEventDTO.dto';
import { BalanceDTO } from './../../domain/dto/getBalanceDTO.dto';
import { AppService } from './../services/app.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/balance')
  accountBalanceById(@Query() query: BalanceDTO, @Res() res) {
    try {
      const result = this.appService.findAccountBalanceById(query.account_id);
      res.status(HttpStatus.OK).json(result);
    } catch (err) {
      const statusCode: number = err.response.statusCode;
      const failResponse = 0;
      res.status(statusCode).json(failResponse);
    }
  }

  @Post('/event')
  event(@Body() eventBody: EventBodyDTO, @Res() res) {
    try {
      const result = this.appService.event(eventBody);
      res.status(HttpStatus.CREATED).json(result);
    } catch (err) {
      const statusCode: number = err.response.statusCode;
      const failResponse = 0;
      res.status(statusCode).json(failResponse);
    }
  }

  @Post('/reset')
  reset(@Res() res) {
    this.appService.reset();
    res.status(HttpStatus.OK).json('OK');
  }
}
