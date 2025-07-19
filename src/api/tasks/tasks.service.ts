import { prisma } from '../../db/prisma.client';
import { CreateTaskDto } from './dto/create-task-dto';

export class TasksService {
  async create(data: CreateTaskDto) {
    return await prisma.task.create({
      data,
    });
  }

  async findAll() {
    return await prisma.task.findMany();
  }

  async findOne(id: number) {
    return await prisma.task.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Partial<CreateTaskDto>) {
    return await prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return await prisma.task.delete({
      where: { id },
    });
  }
}
