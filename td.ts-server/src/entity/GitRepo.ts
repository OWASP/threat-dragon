import { IEntity } from './IEntity';

export class GitRepo implements IEntity {
    repos: string[];
    pagination: {
        page: number,
        next: boolean,
        prev: boolean
    };
}
