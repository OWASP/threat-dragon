import { BaseApiError } from './ApiError';
import { IAuthedRequest } from '../entity';
import { Logger } from '../service/Logger';

export class ForbiddenError extends BaseApiError {
	constructor(req: IAuthedRequest) {
		super(req);
	}
    
	logMessage(logger: Logger): void {
		logger.error(`Forbidden: ${this.getMessage()}`);
	}
}
