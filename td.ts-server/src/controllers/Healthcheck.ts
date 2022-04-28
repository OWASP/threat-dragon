import { AllowAnonymous, Controller, Get } from '../decorators';

@Controller('/healthz')
export class HealthcheckController {
    @Get('/')
    @AllowAnonymous()
    healthcheck(): string {
        return 'ok';
    }
}