'use strict';

function github($q, $routeParams, $location, common, datacontext) {
    // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
    /*jshint validthis: true */
    var vm = this;
    var controllerId = 'github';
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);
    var logError = getLogFn(controllerId, 'error');

    // Bindable properties and functions are placed on vm.
    vm.title = 'Load From GitHub';
    vm.selectBranch = selectBranch;
    vm.selectRepo = selectRepo;
    vm.nextPage = nextPage;
    vm.previousPage = previousPage;
    vm.uriPrefix = uriPrefix;

    activate();

    function activate() {
        common.activateController([load()], controllerId)
            .then(function () { log('Activated GitHub Controller'); });
    }

    function load() {
        vm.error = null;
        vm.organisation = $routeParams.organisation;
        vm.repo = $routeParams.repo;
        vm.branch = $routeParams.branch;

        if (!vm.organisation && !vm.repo) {
            getRepos();
        }
        else {
            if (!vm.branch) {
                getBranches(vm.organisation, vm.repo);
            }
            else {
                getModels(vm.organisation, vm.repo, vm.branch);
            }
        }
    }

    function getRepos() {
        return datacontext.repos($location.search().page).then(
            function (response) {
                vm.pagination = response.data.pagination;
                vm.pagination.page = parseInt(vm.pagination.page, 10);
                vm.repos = response.data.repos;
            },
            function (err) {
                vm.repos = [];
                onError(err);
            }
        );
    }

    function getBranches(organisation, repo) {
        return datacontext.branches(organisation, repo, $location.search().page).then(
            function (response) {
                vm.pagination = response.data.pagination;
                vm.pagination.page = parseInt(vm.pagination.page, 10);
                vm.branches = response.data.branches;
            },
            function (err) {
                vm.branches = [];
                onError(err);
            }
        );
    }

    function getModels(organisation, repo, branch) {
        return datacontext.models(organisation, repo, branch).then(
            function (response) {
                vm.models = response.data;
            },
            function (err) {
                vm.models = [];
                onError(err);
            });
    }

    function selectBranch(branch) {
        $location.url(uriPrefix() + 'threatmodel/' + vm.organisation + '/' + vm.repo + '/' + branch);
    }

    function selectRepo(repoFullName) {
        $location.url(uriPrefix() + 'threatmodel/' + repoFullName);
    }

    function nextPage() {
        if (vm.pagination.next) {
            $location.search('page', vm.pagination.page + 1);
        } else {
            logError('Cannot navigate to next page');
        }
    }

    function previousPage() {
        if (vm.pagination.prev) {
            $location.search('page', vm.pagination.page - 1);
        } else {
            logError('Cannot navigate to previous page');
        }
    }

    function uriPrefix() {
        return $location.path().substr(0, 16) === '/new/threatmodel' ? 'new/' : '';
    }

    function onError(err) {
        vm.error = err;
        logError(err.data.message);
    }
}

module.exports = github;