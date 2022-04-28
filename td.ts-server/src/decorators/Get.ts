import { METHOD } from './Method';
import { RequestDecorator } from './Request';

export const Get = (path: string): MethodDecorator => RequestDecorator(path, METHOD.GET);
