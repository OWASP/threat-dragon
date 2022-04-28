import { BaseApiResponse, HTTP_STATUS } from './ApiResponse';

export class UnauthorizedResponse<T> extends BaseApiResponse<T> {
	constructor() {
		super(HTTP_STATUS.unauthorized, 'Unauthorized');
	}
}
