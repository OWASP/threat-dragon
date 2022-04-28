import { BaseApiResponse, HTTP_STATUS } from './ApiResponse';

export class NotFoundResponse<T> extends BaseApiResponse<T> {
	constructor() {
		super(HTTP_STATUS.notFound, 'Resource not found');
	}
}
