import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { Student } from './students.model';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeyGuard } from '../guards/api-key.guard';

@ApiBearerAuth('apiKey')
@UseGuards(ApiKeyGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll(): Promise<Student[]> {
    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Student> {
    return this.studentsService.findOne(id);
  }

  @Post()
  create(@Body() student: Student): Promise<void> {
    return this.studentsService.create(student);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() student: Student): Promise<void> {
    return this.studentsService.update(id, student);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.studentsService.delete(id);
  }
}
