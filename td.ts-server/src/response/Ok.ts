import { BaseApiResponse, HTTP_STATUS } from './ApiResponse';

export class OkResponse<T> extends BaseApiResponse<T> {
	constructor(body: any) {
		super(HTTP_STATUS.ok, body);
	}
}
