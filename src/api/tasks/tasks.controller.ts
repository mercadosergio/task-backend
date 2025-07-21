import { container } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { CreateTaskDto } from "./dto/create-task-dto";
import { TasksService } from "./tasks.service";

export class TasksController {
    private tasksService: TasksService;

    constructor() {
        this.tasksService = container.resolve(TasksService);
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { body } = req;

            const product = await this.tasksService.create(
                body as CreateTaskDto,
            );
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    getAll = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await this.tasksService.findAll();
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    };


    getOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const result = await this.tasksService.findOne(+id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const result = await this.tasksService.delete(+id);

            res.status(200).json({ message: `Task ${result.text} deleted` });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { body } = req;

            const changes = await this.tasksService.update(
                +id,
                body
            );

            res.status(200).json({ message: `Task ${changes.text} updated`, changes });
        } catch (error) {
            next(error);
        }
    };

}