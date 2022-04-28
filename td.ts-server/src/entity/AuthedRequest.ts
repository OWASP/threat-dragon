import { Request } from 'express';

import { ITdProvider, ITdUser } from '.';

export interface IAuthedRequest extends Request {
    provider: ITdProvider;
    user: ITdUser;
}
