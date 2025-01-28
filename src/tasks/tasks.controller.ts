import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    Logger,
  } from '@nestjs/common';
  import { TasksService } from './tasks.service';
  import { CreateTaskDto } from './dto/create-task.dto';
  import { UpdateTaskDto } from './dto/update-task.dto';
  import { LoggingInterceptor } from '../interceptors/logging.interceptor';
  
  @Controller('tasks')
  @UseInterceptors(LoggingInterceptor)
  export class TasksController {
    private readonly logger = new Logger(TasksController.name);
  
    constructor(private readonly tasksService: TasksService) {}
  
    @Post()
    create(@Body() createTaskDto: CreateTaskDto) {
      this.logger.log(`Creating new task: ${createTaskDto.title}`);
      return this.tasksService.create(createTaskDto);
    }
  
    @Get()
    findAll() {
      this.logger.log('Retrieving all tasks');
      return this.tasksService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      this.logger.log(`Retrieving task with id: ${id}`);
      return this.tasksService.findOne(id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
      this.logger.log(`Updating task with id: ${id}`);
      return this.tasksService.update(id, updateTaskDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      this.logger.log(`Deleting task with id: ${id}`);
      return this.tasksService.remove(id);
    }
  }