import {expect} from 'chai';
import github from 'octonode';
import sinon from 'sinon';

import env from '../../src/env/Env.js';
import threatModelRepository from '../../src/repositories/githubrepo.js';

describe('repositories/githubrepo.js', () => {
  const info = {
    body: {
      content: 'test content',
      id: 1
    },
    branch: 'testBranch',
    organisation: 'test org',
    page: 'testPage',
    repo: 'test repo'
  };
  const content = [
    {
      sha: 'asdf'
    }
  ];
  const accessToken = 'access token';
  const repoFullName = `${info.organisation}/${info.repo}`;
  const modelContent = JSON.stringify(info.body, null, '  ');
  const modelPath = `ThreatDragonModels/${info.model}/${info.model}.json`;

  const mockClient = {
    me: () => {
    },
    infoAsync: () => Promise.resolve([{}, {}]),
    reposAsync: () => {
    },
    repo: () => {
    }
  };

  const mockRepo = {
    branchesAsync: () => {
    },
    contentsAsync: () => {
    },
    createContentsAsync: () => {
    },
    deleteContentsAsync: () => {
    },
    updateContentsAsync: () => {
    },
    createRefAsync: () => {
    },
    refAsync: () => [{object: content[0]}]
  };

  beforeEach(() => {
    sinon.stub(github, 'client').returns(mockClient);
    sinon.stub(mockClient, 'repo').returns(mockRepo);
    sinon.stub(mockRepo, 'contentsAsync').resolves(content);
  });

  describe('userAsync', () => {
    beforeEach(async () => {
      sinon.stub(mockClient, 'me').returns(mockClient);
      sinon.spy(mockClient, 'infoAsync');
      await threatModelRepository.userAsync(accessToken);
    });

    it('creates the github client', () => {
      expect(github.client).to.have.been.calledWith(accessToken);
    });

    it('calls me', () => {
      expect(mockClient.me).to.have.been.calledOnce;
    });

    it('calls infoAsync', () => {
      expect(mockClient.infoAsync).to.have.been.calledOnce;
    });
  });

  describe('with enterprise hostname', () => {
    const enterpriseHostname = 'fakehost';

    beforeEach(async () => {
      sinon.stub(env, 'get').returns({config: {GITHUB_ENTERPRISE_HOSTNAME: enterpriseHostname}});
      sinon.stub(mockClient, 'me').returns(mockClient);
      await threatModelRepository.reposAsync(info.page, accessToken);
    });

    it('creates the github client with the enterprise hostname', () => {
      expect(github.client).to.have.been.calledWith(accessToken, {hostname: `${enterpriseHostname}/api/v3`});
    });
  });

  describe('with enterprise hostname and port', () => {
    const enterpriseHostname = 'fakehost';
    const enterprisePort = '8443';

    beforeEach(async () => {
      sinon.stub(env, 'get').returns({
        config: {
          GITHUB_ENTERPRISE_HOSTNAME: enterpriseHostname,
          GITHUB_ENTERPRISE_PORT: enterprisePort
        }
      });
      sinon.stub(mockClient, 'me').returns(mockClient);
      await threatModelRepository.reposAsync(info.page, accessToken);
    });

    it('creates the github client with the enterprise hostname and port', () => {
      expect(github.client).to.have.been.calledWith(accessToken, {
        hostname: `${enterpriseHostname}/api/v3`,
        port: 8443
      });
    });
  });

  describe('with enterprise hostname, port, and protocol', () => {
    const enterpriseHostname = 'fakehost';
    const enterprisePort = '8443';
    const enterpriseProtocol = 'https';

    beforeEach(async () => {
      sinon.stub(env, 'get').returns({
        config: {
          GITHUB_ENTERPRISE_HOSTNAME: enterpriseHostname,
          GITHUB_ENTERPRISE_PORT: enterprisePort,
          GITHUB_ENTERPRISE_PROTOCOL: enterpriseProtocol
        }
      });
      sinon.stub(mockClient, 'me').returns(mockClient);
      await threatModelRepository.reposAsync(info.page, accessToken);
    });

    it('creates the github client with the enterprise hostname, port and protocol', () => {
      expect(github.client).to.have.been.calledWith(accessToken, {
        hostname: `${enterpriseHostname}/api/v3`,
        port: 8443,
        protocol: enterpriseProtocol
      });
    });
  });

  describe('reposAsync', () => {
    beforeEach(async () => {
      sinon.stub(mockClient, 'me').returns(mockClient);
      sinon.spy(mockClient, 'reposAsync');
      await threatModelRepository.reposAsync(info.page, accessToken);
    });

    it('creates the github client', () => {
      expect(github.client).to.have.been.calledWith(accessToken);
    });

    it('calls me', () => {
      expect(mockClient.me).to.have.been.calledOnce;
    });

    it('calls reposAsync', () => {
      expect(mockClient.reposAsync).to.have.been.calledWith(info.page);
    });
  });

  describe('branchesAsync', () => {
    beforeEach(async () => {
      sinon.stub(mockRepo, 'branchesAsync').resolves();
      await threatModelRepository.branchesAsync(info, accessToken);
    });

    it('creates the client', () => {
      expect(github.client).to.have.been.calledWith(accessToken);
    });

    it('gets the repo', () => {
      expect(mockClient.repo).to.have.been.calledWith(repoFullName);
    });

    it('gets the branches for the repo', () => {
      expect(mockRepo.branchesAsync).to.have.been.calledWith(info.page);
    });
  });

  describe('modelsAsync', () => {
    beforeEach(async () => {
      await threatModelRepository.modelsAsync(info, accessToken);
    });

    it('should create the github client', () => {
      expect(github.client).to.have.been.calledWith(accessToken);
    });

    it('should get the repo', () => {
      expect(mockClient.repo).to.have.been.calledWith(repoFullName);
    });

    it('should get the contents', () => {
      expect(mockRepo.contentsAsync).to.have.been.calledWith('ThreatDragonModels', info.branch);
    });
  });

  describe('modelAsync', () => {
    beforeEach(async () => {
      await threatModelRepository.modelAsync(info, accessToken);
    });

    it('should create the github client', () => {
      expect(github.client).to.have.been.calledWith(accessToken);
    });

    it('should get the repo', () => {
      expect(mockClient.repo).to.have.been.calledWith(repoFullName);
    });

    it('should get the contents', () => {
      expect(mockRepo.contentsAsync).to.have.been.calledWith(modelPath, info.branch);
    });
  });

  describe('createAsync', () => {
    beforeEach(async () => {
      sinon.stub(mockRepo, 'createContentsAsync').resolves();
      await threatModelRepository.createAsync(info, accessToken);
    });

    it('should create the github client', () => {
      expect(github.client).to.have.been.calledWith(accessToken);
    });

    it('should get the repo', () => {
      expect(mockClient.repo).to.have.been.calledWith(repoFullName);
    });

    it('should get the contents', () => {
      expect(mockRepo.createContentsAsync).to.have.been.calledWith(
        modelPath,
        'Created by OWASP Threat Dragon',
        modelContent,
        info.branch
      );
    });
  });

  describe('updateAsync', () => {
    beforeEach(async () => {
      sinon.stub(mockRepo, 'updateContentsAsync');
      await threatModelRepository.updateAsync(info, accessToken);
    });

    it('creates a github client', () => {
      expect(github.client).to.have.been.calledWith(accessToken);
    });

    it('calls client.repo', () => {
      expect(mockClient.repo).to.have.been.calledWith(`${info.organisation}/${info.repo}`);
    });

    it('calls repo.updateContents', () => {
      expect(mockRepo.updateContentsAsync).to.have.been.calledWith(
        modelPath,
        'Updated by OWASP Threat Dragon',
        JSON.stringify(info.body, null, '  '),
        content[0].sha,
        info.branch
      );
    });
  });


  describe('deleteAsync', () => {
    beforeEach(async () => {
      sinon.stub(mockRepo, 'deleteContentsAsync').resolves();
      await threatModelRepository.deleteAsync(info, accessToken);
    });

    it('creates a github client', () => {
      expect(github.client).to.have.been.calledWith(accessToken);
    });

    it('calls client.repo', () => {
      expect(mockClient.repo).to.have.been.calledWith(`${info.organisation}/${info.repo}`);
    });

    it('calls repo.deleteContents', () => {
      expect(mockRepo.deleteContentsAsync).to.have.been.calledWith(
        modelPath,
        'Deleted by OWASP Threat Dragon',
        content[0].sha,
        info.branch
      );
    });
  });

  describe('create branch', () => {
    beforeEach(async () => {
      sinon.stub(mockRepo, 'createRefAsync').resolves();
      await threatModelRepository.createBranchAsync(info, accessToken);
    });
    it('create a new branch', () => {
      expect(mockRepo.createRefAsync).to.have.been.calledWith(`refs/heads/${info.branch}`, content[0].sha);
    });
  });
});
