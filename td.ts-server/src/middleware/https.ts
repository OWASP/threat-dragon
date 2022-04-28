import { NextFunction, Request, Response } from 'express';
import { getEnv } from '../env/Env';

export default (req: Request, res: Response, next: NextFunction) => {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && getEnv().config.SERVER_API_PROTOCOL === 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
    }

    return next();
};
