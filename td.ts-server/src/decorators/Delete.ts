import { METHOD } from './Method';
import { RequestDecorator } from './Request';

export const Delete = (path: string): MethodDecorator => RequestDecorator(path, METHOD.DELETE);
