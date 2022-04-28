import { BaseApiError } from './ApiError';
import { IAuthedRequest } from '../entity';
import { Logger } from '../service/Logger';

export class NotFoundError extends BaseApiError {
	constructor(req: IAuthedRequest) {
		super(req);
	}
    
	logMessage(logger: Logger): void {
		logger.error(`Not Found: ${this.getMessage()}`);
	}
}
