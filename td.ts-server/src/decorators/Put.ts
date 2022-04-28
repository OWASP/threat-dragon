import { METHOD } from './Method';
import { RequestDecorator } from './Request';

export const Put = (path: string): MethodDecorator => RequestDecorator(path, METHOD.PUT);
