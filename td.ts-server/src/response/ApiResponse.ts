import { Response } from 'express';

export enum HTTP_STATUS {
	ok = 200,
	created = 201,
	accepted = 202,

	temporaryRedirect = 302,

	badRequest = 400,
	unauthorized = 401,
	forbidden = 403,
	notFound = 404,

	serverError = 500
}

export interface IApiResponse<T> {
	get status(): HTTP_STATUS;
	get body(): T;
}

export abstract class BaseApiResponse<T> implements IApiResponse<T> {
	private readonly _status: HTTP_STATUS;
	get status() { return this._status; }

	private readonly _body: any;
	get body() { return this._body; }

	constructor(status: HTTP_STATUS, body: any) {
		this._status = status;
		this._body = body;
	}

	toResponse(res: Response): Response | void {
		const code: number = this._status;
		return res.status(code)
			.json({
				status: code,
				body: this._body
			});
	}
}
