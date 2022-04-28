export const AllowAnonymous = (): MethodDecorator => {
	return function (target: unknown) {
		Reflect.defineMetadata('allowAnonymous', true, target);
	};
};
