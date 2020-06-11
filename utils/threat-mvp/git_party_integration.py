from git import Repo
import logger as log
import mail

def git_push(repo, message, files):
    try:
        repo.index.add(files)
        repo.index.commit(message)
        repo_remote = repo.remote('origin')
        repo_remote.push()
    except Exception as e:
        log.logger.error("Exception occurred while pushing code", exc_info=True)
        mail.sendErrorEmail("Threat Model: Exception occurred while pushing code", e)  
        raise e

def git_pull(repo):
    try:
        repo_remote = repo.remote('origin')
        repo_remote.pull()
    except Exception as e:
        log.logger.error("Exception occurred while pulling code", exc_info=True)
        mail.sendErrorEmail("Threat Model: Exception occurred while pulling code", e)
        raise e

def git_clone(remote_path, local_path):
    try:
        repo = Repo.clone_from(
            remote_path,
            local_path,
            branch='master'
        )
        return repo
    except Exception as e:
        log.logger.error("Exception occurred while cloning code", exc_info=True)
        mail.sendErrorEmail("Threat Model: Exception occurred while cloning code", e)  
        raise e

def get_status(repo):
    changed = [ item.a_path for item in repo.index.diff(None) ]
    return changed

def discover_git(remote_path, local_path):
    try:
        repo = Repo(local_path)
        return repo
    except:
        repo = git_clone(remote_path, local_path)
        return repo