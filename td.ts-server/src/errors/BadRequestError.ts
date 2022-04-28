import { BaseApiError } from './ApiError';
import { IAuthedRequest } from '../entity';
import { Logger } from '../service/Logger';

export class BadRequestError extends BaseApiError {
	private readonly _errorMessage: string;
	get errorMessage(): string { return this._errorMessage; }

	constructor(req: IAuthedRequest, errorMessage?: string) {
		super(req);
		this._errorMessage = errorMessage || 'unknown';
	}

	logMessage(logger: Logger): void {
		logger.error(`Bad Request: ${this._errorMessage} ${this.getMessage()}`);
	}
}
