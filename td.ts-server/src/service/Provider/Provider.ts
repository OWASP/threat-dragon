import { ITdUser } from '../../entity';

export interface IAuthProvider {
    get name(): string;
    get isConfigured(): boolean;
}

export interface IOAuthProvider extends IAuthProvider {
    get redirectUrl(): string;
    getReturnUrl(code: string): string;
    completeLogin(code: string): Promise<{ user: ITdUser, opts: any}>;
}