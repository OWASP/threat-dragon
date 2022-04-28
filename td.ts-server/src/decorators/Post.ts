import { METHOD } from './Method';
import { RequestDecorator } from './Request';

export const Post = (path: string): MethodDecorator => RequestDecorator(path, METHOD.POST);
