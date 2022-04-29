import { IEntity, ITdProvider } from '../entity';

export interface IReadOnlyRepo<T extends IEntity> {
    getAll(token: string): Promise<T[]>;
    getById(token: string, id: any): Promise<T>;
}

export abstract class BaseReadOnlyRepo<T extends IEntity> implements IReadOnlyRepo<T> {
    abstract getAll(token: string): Promise<T[]>;
    abstract getById(token: string, id: any): Promise<T>;
}