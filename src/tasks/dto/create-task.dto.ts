import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date) 
  dueDate?: Date;
}