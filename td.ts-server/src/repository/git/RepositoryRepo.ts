import { BaseGitRepo } from './BaseGitRepo';
import { GitRepo } from '../../entity';

export class GitRepositoryRepo extends BaseGitRepo<GitRepo> {

    getAll(token: string): Promise<GitRepo[]> {
        
        return Promise.resolve(null);
    }
    
    getById(token: string, id: any): Promise<GitRepo> {
        throw new Error('Method not implemented.');
    }

}