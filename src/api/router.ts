import path from 'path';
import { Router, Application, static as staticFiles } from 'express';
import AuthRouter from './auth/auth.routes';
import TasksRouter from './tasks/tasks.routes';

export function routerApi(app: Application) {
  const router: Router = Router();
  app.use('/api', router);

  const uploads = path.join(__dirname, '../../public/uploads');
  const productsStaticRoute = path.join(uploads, 'products');
  const categoriesStaticRoute = path.join(uploads, 'categories');

  router.use('/public/uploads', staticFiles(uploads));
  router.use('/public/uploads/products', staticFiles(productsStaticRoute));
  router.use('/public/uploads/categories', staticFiles(categoriesStaticRoute));

  router.use('/auth', AuthRouter);
  router.use('/tasks', TasksRouter);
}
