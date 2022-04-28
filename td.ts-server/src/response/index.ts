import { BadRequestResponse } from './BadRequest';
import { ForbiddenResponse } from './Forbidden';
import { NotFoundResponse } from './NotFound';
import { OkResponse } from './Ok';
import { ServerErrorResponse } from './ServerError';
import { UnauthorizedResponse } from './Unauthorized';

export const badRequest = <T>(errorMessage?: string) => new BadRequestResponse<T>(errorMessage);
export const forbidden = <T>() => new ForbiddenResponse<T>();
export const notFound = <T>() => new NotFoundResponse<T>();
export const ok = <T>(body: any) => new OkResponse<T>(body);
export const serverError = <T>() => new ServerErrorResponse<T>();
export const unauthorized = <T>() => new UnauthorizedResponse<T>();

export * from './ApiResponse';

export default {
	badRequest,
	forbidden,
	notFound,
	ok,
	serverError,
	unauthorized
};
