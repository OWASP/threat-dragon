import { Express, Request, Response, NextFunction } from 'express';

import { authMiddleware } from '../middleware/auth';
import { Logger } from '../service/Logger';
import { RouteDefinition } from './RouteDefinition';

export const Controller = (prefix = ''): ClassDecorator => {
	return (target: any) => {
		Reflect.defineMetadata('prefix', prefix, target);
	};
};

export const registerControllers = (app: Express, logger: Logger, controllers: any[]): void => {
	controllers.forEach((controller) => registerController(app, logger, controller));
};

export const registerController = (app: Express, logger: Logger, controller: any): void => {
	const instance = new controller();
	const prefix = Reflect.getMetadata('prefix', controller);
	const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);
	const passThrough = (req: Request, res: Response, next: NextFunction) => next();

	routes.forEach((route) => {
		logger.info(`Registered ${route.method.toUpperCase()} - /api${prefix + route.path}`);
		app[route.method](
			'/api' + prefix + route.path,
			route.allowAnonymous ? passThrough : authMiddleware,
			(req: Request, res: Response) => route.implementation(req, res, instance)
		);
	});
};