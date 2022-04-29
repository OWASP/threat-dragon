import { Octokit } from '@octokit/rest';

import { BaseReadOnlyRepo } from '../ReadOnlyRepo';
import { Env, getEnv } from '../../env/Env';
import { IEntity } from '../../entity';

export abstract class BaseGitRepo<T extends IEntity> extends BaseReadOnlyRepo<T> {
    protected readonly env: Env;
    protected readonly octokit: Octokit;

    constructor() {
        super();
        this.env = getEnv();

        // TODO: Account for GH Enterprise
        // https://github.com/octokit/octokit.js#constructor-options
        this.octokit = new Octokit();
    }
}
