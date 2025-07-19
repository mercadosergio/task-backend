import { Router } from "express";
import { container } from "tsyringe";
import { TasksController } from "./tasks.controller";

const controller = container.resolve(TasksController);

const router = Router();

router.post('/', controller.create)
    .get('/', controller.getAll)
    .get('/:id', controller.getOne)
    .put('/:id', controller.update)
    .delete('/:id', controller.delete);

export default router