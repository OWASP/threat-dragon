/**
 * GitLab dataset for subgroup repository E2E tests.
 */
const dataset = Object.freeze({
    repos: {
        org: 'parent',
        subgroupRepo: 'direct_child_1/sub_child_1/sub_child_2/repo_1',
        fullName: 'parent/direct_child_1/sub_child_1/sub_child_2/repo_1'
    },
    branches: {
        names: ['main', 'release/v2.6.2', 'feature/subgroup-routing']
    },
    models: {
        names: ['Gateway Threat Model', 'Nested Repo Model'],
        data: {
            version: '2.6.2',
            summary: {
                title: 'Gateway Threat Model',
                owner: 'Threat Dragon',
                description: 'GitLab subgroup routing fixture'
            },
            detail: {
                contributors: [],
                diagrams: [],
                diagramTop: 0,
                reviewer: '',
                threatTop: 0
            }
        }
    }
});

module.exports = dataset;
