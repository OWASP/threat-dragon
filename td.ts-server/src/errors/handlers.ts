import { NextFunction, Request, Response } from 'express';

import { Logger } from '../service/Logger';

const logger = new Logger('errors/handlers.ts');

export const catchAllHandler = (err: Error, req: Request, res: Response): Response => {
	logger.error(err);
	return res.status(500)
		.json({
			status: 500,
			body: 'Internal server error'
		});
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): Response => {
	if (!res.headersSent) {
		logger.info(`Returning 404 for ${req.path}`);
		return res.status(404)
			.json({
				status: 404,
				body: 'Resource not found'
			});
	} else {
		next();
	}
};
