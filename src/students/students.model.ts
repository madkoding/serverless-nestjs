import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Student {
  @ApiProperty({ description: 'Id unico del estudiante' })
  id: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Nombre del estudiante' })
  name: string;

  @IsInt()
  @Min(0)
  @Max(120)
  @ApiProperty({ description: 'Edad' })
  age: number;

  @IsInt()
  @Min(1)
  @Max(12)
  @ApiProperty({ description: 'Curso' })
  grade: number;
}
