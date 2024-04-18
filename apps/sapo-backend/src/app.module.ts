import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SubjectsController } from './subjects/subjects.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { environments } from 'libs/common/configuration/environments';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'SUBJECTS_MICROSERVICE', transport: Transport.TCP },
    ]),
  ],
  controllers: [AppController, SubjectsController],
  providers: [AppService],
})
export class AppModule {}
