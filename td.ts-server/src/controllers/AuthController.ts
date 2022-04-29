import { Request, Response } from 'express';

import { AllowAnonymous, Controller, Get } from '../decorators';
import { BadRequestError } from '../errors';
import { getProviderByName } from '../service/Provider';
import { IAuthedRequest } from '../entity';

@Controller('/auth')
export class AuthController {
    @Get('/login/:provider')
    @AllowAnonymous()
    login(req: Request, res: Response) {
        try {
            const provider = getProviderByName(req.params.provider);
            // TODO: How do we handle redirects?
        }
        catch (err) {
            throw new BadRequestError(req as IAuthedRequest, 'Invalid login');
        }
    }
}