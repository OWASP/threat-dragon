import { BaseReadOnlyRepo } from './ReadOnlyRepo';
import { GitRepo } from '../entity';

export class GitRepoRepo extends BaseReadOnlyRepo<GitRepo> {
    getAll(token: string): Promise<GitRepo[]> {
        throw new Error('Method not implemented.');
    }
    getById(token: string, id: any): Promise<GitRepo> {
        throw new Error('Method not implemented.');
    }
}