import { Request, Response } from 'express';

import {
	BaseApiError,
	BadRequestError,
	ForbiddenError,
	NotFoundError,
	UnauthorizedError
} from '../errors';
import { Logger } from '../service/Logger';
import { METHOD } from './Method';
import { RouteDefinition } from './RouteDefinition';
import response, { BaseApiResponse } from '../response';

const getErrorResponse = (err: BaseApiError, res: Response): Response | void => {
	if (err instanceof BadRequestError) {
		return response.badRequest((err as BadRequestError).errorMessage).toResponse(res);
	}
	if (err instanceof ForbiddenError) {
		return response.forbidden().toResponse(res);
	}
	if (err instanceof NotFoundError) {
		return response.notFound().toResponse(res);
	}
	if (err instanceof UnauthorizedError) {
		return response.unauthorized().toResponse(res);
	}
	return response.serverError().toResponse(res);
};

const getResponseWrapper = <T>(verb: string, body: unknown): BaseApiResponse<T> => {
	if (body === null) {
		return response.notFound();
	}

    return response.ok(body);
};

export const RequestDecorator = (path: string, method: METHOD): MethodDecorator => {
	const logger = new Logger('decorators/Request.ts');

	return function (target: unknown, propertyKey: string) {
		const implementation = async (req: Request, res: Response, instance: any) => {
			try {
				const original = await instance[propertyKey](req, res);
				return getResponseWrapper(req.method, original).toResponse(res);
			} catch (err) {
				if (err instanceof BaseApiError) {
					err.logMessage(logger);
					return getErrorResponse(err, res);
				} else {
					logger.error('Unhandled error:');
					logger.error(err);
					return response.serverError().toResponse(res);
				}
			}
		};

		if (!Reflect.hasMetadata('routes', target.constructor)) {
			Reflect.defineMetadata('routes', [], target.constructor);
		}

		if (!Reflect.hasMetadata('prefix', target.constructor)) {
			Reflect.defineMetadata('prefix', '', target.constructor);
		}

		const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;
		const allowAnonymous = Reflect.getMetadata('allowAnonymous', target) as boolean;
		routes.push({
			path,
			method,
			implementation,
			allowAnonymous
		});
		Reflect.defineMetadata('routes', routes, target.constructor);
	};
};
