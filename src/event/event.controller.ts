import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Controller('event')
export class EventController {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  @Get()
  async findAll() {
    return await this.repository.find();
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return await this.repository.findOne(id);
  // }

  @Get('/search')
  async search() {
    return await this.repository.find({
      select: ['id', 'when'],
      where: { id: MoreThan(1) },
      order: { when: 'DESC' },
      take: 2,
      skip: 1,
    });
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOne(id);
    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const event = await this.repository.findOne(id);
    return await this.repository.delete(event);
  }
}
