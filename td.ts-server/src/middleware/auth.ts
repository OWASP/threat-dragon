import { Response, NextFunction } from 'express';

import { IAuthedRequest } from '../entity';
import { JwtService } from '../service';
import { Logger } from '../service/Logger';
import response from '../response';

const logger = new Logger('middleware/auth.ts');

const getBearerToken = (authHeader: string | null): string | null => {
    if (!authHeader) {
        logger.info(`Bearer token not found, auth header is empty`);
        return null;
    }

    if (authHeader.indexOf('Bearer ') === -1) {
        logger.info(`Bearer token key word not found in auth header: ${authHeader}`);
        return null;
    }

    return authHeader.split(' ')[1];
};

export const authMiddleware = async (req: IAuthedRequest, res: Response, next: NextFunction) => {
	const token = getBearerToken(req.headers.authorization);
    if (!token) {
        logger.info(`Bearer token not found for resource that requires authentication: ${req.url}`);
        return response.unauthorized().toResponse(res);
    }

    const jwt = new JwtService();

    try {
        const { provider, user } = jwt.verifyToken(token);
        req.provider = provider;
        req.user = user;
        return next();
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            logger.audit('Expired JWT encountered');
            return response.unauthorized().toResponse(res);
        }
        
        logger.audit('Error decoding JWT');
        logger.error(e);
        return response.badRequest('Invalid JWT').toResponse(res);
    }
};
