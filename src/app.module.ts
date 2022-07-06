import { AppService } from './application/services/app.service';
import { AppController } from './application/controllers/app.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
