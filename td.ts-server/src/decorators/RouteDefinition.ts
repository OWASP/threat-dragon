import { Request, Response } from 'express';

import { METHOD } from './Method';

type ExpressResponseHandler = (req: Request, res: Response, instance: any) => any;

export interface RouteDefinition {
    path: string,
    method: METHOD,
    implementation: ExpressResponseHandler,
    allowAnonymous: boolean
}
