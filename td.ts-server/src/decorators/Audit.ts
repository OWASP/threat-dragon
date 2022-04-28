import { IAuthedRequest } from '../entity';
import { Logger } from '../service/Logger';

export const Audit = (): MethodDecorator => {
    const logger = new Logger('decorators/Audit.ts');
    
	return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
		const original = descriptor.value;

		descriptor.value = function (...args: any[]) {
			const request = args[0] as IAuthedRequest;
			const { url, method, user } = request;
            
			const username = user ? user.username : '(unknown?)';
			const msg = `${method.toUpperCase()}: ${url} by user ${username}`;
			logger.audit(msg);
            
			return original.apply(this, args);
		};
	};
};
