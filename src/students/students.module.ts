import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, DocumentClient],
})
export class StudentsModule {}
