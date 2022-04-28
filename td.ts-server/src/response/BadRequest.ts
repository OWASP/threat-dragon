import { BaseApiResponse, HTTP_STATUS } from './ApiResponse';

export class BadRequestResponse<T> extends BaseApiResponse<T> {
	constructor(errorMessage?: string) {
		super(HTTP_STATUS.badRequest, errorMessage || 'Bad Request');
	}
}
