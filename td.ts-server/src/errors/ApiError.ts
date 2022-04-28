import { IAuthedRequest } from '../entity';
import { Logger } from '../service/Logger';

export interface IApiError {
	logMessage(logger: Logger): void;
}

export abstract class BaseApiError extends Error implements IApiError {
	private readonly verb: string;
	private readonly path: string;
	private readonly username: string;

	constructor(req: IAuthedRequest) {
		super('Api Error');
		this.verb = req.method;
		this.path = req.path;
		this.username = req.user.username;
	}

	abstract logMessage(logger: Logger): void;

	protected getMessage(): string {
		return `${this.verb.toUpperCase()} ${this.path}: ${this.username || '(unkown user)'}`;
	}
}
