import express, {
  Application,
  json,
  Request,
  Response,
  Router,
  urlencoded
} from 'express';
import cors from 'cors';
import { env } from './config/env';
import path from 'path';
import fs from 'fs';
import {
  boomErrorHandler,
  errorHandler,
  logErrors
} from './middlewares/error.handler';
import { routerApi } from './api/router';
import passport from 'passport';
import { container } from 'tsyringe';
import { LocalStrategy } from './api/auth/strategies/local.strategy';
import { JwtStrategy } from './api/auth/strategies/jwt.strategy';

export default class Server {
  app: Application;

  constructor(private port?: number | string) {
    this.app = express();
    this.app.set('port', this.port || env.PORT || 8000);
    this.app.get('/', (_req: Request, res: Response) => {
      res.send('SERVER IS WORKING');
    });
    this.bootstrap();
  }

  async bootstrap() {
    this.middlewares();
    // this.loadApiRoutes();
    // this.routes();
    this.loadPassportStrategies();
    routerApi(this.app);
    this.app.use(logErrors);
    this.app.use(boomErrorHandler);
    this.app.use(errorHandler);
  }

  loadPassportStrategies() {
    const localStrategy = container.resolve(LocalStrategy);
    const jwtStrategy = container.resolve(JwtStrategy);
    passport.use(localStrategy);
    passport.use(jwtStrategy);
  }

  routes(): void {
    const routesPath = path.join(__dirname, 'api');

    fs.readdirSync(routesPath)
      .filter((fileOrDir) =>
        fs.statSync(path.join(routesPath, fileOrDir)).isDirectory()
      )
      .forEach((moduleName) => {
        const routeFile = path.join(
          routesPath,
          moduleName,
          `${moduleName}.routes.ts`
        );

        if (fs.existsSync(routeFile)) {
          // try {
          import(routeFile)
            .then((routerModule) => {
              this.app.use(`/api/v1/${moduleName}`, routerModule.default); // Monta el enrutador con un prefijo
              console.log(`Loaded routes for module: ${moduleName}`);
            })
            .catch((err) => {
              console.error(
                `Error loading routes for module ${moduleName}:`,
                err
              );
            });
          // } catch (error: any) {
          //   console.error(`Not exist file route for ${moduleName}`);
          // }
        }
      });
  }

  middlewares(): void {
    this.app.use(express.static(__dirname + '/public'));
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  async loadApiRoutes(): Promise<void> {
    const apiDir = path.join(__dirname, 'api');

    for (const dirent of fs.readdirSync(apiDir, { withFileTypes: true })) {
      if (dirent.isDirectory()) {
        const folderName = dirent.name;
        const basePath = path.join(apiDir, folderName, `${folderName}.routes`);
        const tsPath = `${basePath}.ts`;
        const jsPath = `${basePath}.js`;

        if (fs.existsSync(tsPath) || fs.existsSync(jsPath)) {
          try {
            const routeModule = await import(basePath);
            const route = routeModule.default as Router;
            this.app.use(`/api/${folderName}`, route);
          } catch (error: any) {
            console.error(`Not exist file route for ${folderName}`);
          }
        }
      }
    }
  }

  async listen() {
    this.app.listen(this.app.get('port'));
    console.log(`Listening at http://localhost:${env.PORT}`);
  }
}
