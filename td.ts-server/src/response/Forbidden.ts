import { BaseApiResponse, HTTP_STATUS } from './ApiResponse';

export class ForbiddenResponse<T> extends BaseApiResponse<T> {
	constructor() {
		super(HTTP_STATUS.forbidden, 'Forbidden');
	}
}
