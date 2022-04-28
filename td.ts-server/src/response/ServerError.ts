import { BaseApiResponse, HTTP_STATUS } from './ApiResponse';

export class ServerErrorResponse<T> extends BaseApiResponse<T> {
	constructor() {
		super(HTTP_STATUS.serverError, 'Internal Server Error');
	}
}
