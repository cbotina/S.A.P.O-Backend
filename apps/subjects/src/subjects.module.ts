import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@app/common';
import { Subject } from './entities/subject.entity';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   validationSchema: Joi.object({
    //     POSTGRESQL_URI: Joi.string().required(),
    //   }),
    //   envFilePath: './apps/subjects/.env',
    // }),
    DatabaseModule,
    TypeOrmModule.forFeature([Subject]),
  ],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
