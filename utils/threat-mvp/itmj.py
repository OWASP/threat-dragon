# Import Built-In Modules
import sys

# Import Custom Modules
import logger as log
import read_json_td
import parse_json_td
import git_party_integration

# Read Config file
import configparser
config = configparser.ConfigParser()
config.read('config.ini')

from git import Repo
import glob

# Set Global vars
global threatJasonPath
global projectJiraKey
global epicJiraKey

def readArgs():
    outcome = True
    global threatJasonPath

    if len(sys.argv) == 2:
        threatJasonPath = sys.argv[1]
    else:    
        outcome = False

    return outcome

if __name__== "__main__" :

    localSource = config['app']['localSource']
    gitEnabled = str(config['app']['gitEnabled']).lower() in ("yes", "true")

    if gitEnabled:
        remoteSource = config['app']['remoteSource']
        repo = git_party_integration.discover_git(remoteSource, localSource)
        git_party_integration.git_pull(repo)

    # Check if we want to run an individual JSON file
    getParams = readArgs()
    if getParams:
        log.logger.info(f'Process Individual')
        files = [threatJasonPath]
    else:
        log.logger.info(f'Process All')    
        files = [threatJasonPath for threatJasonPath in glob.glob(localSource +  "/**/*.json", recursive=True)]

    # Loop through all the JSON files
    for threatJasonPath in files:
        dictDragon = read_json_td.read_json(threatJasonPath)
        parse_json_td.parseJson(dictDragon, threatJasonPath)
        log.logger.info(f'Finish processing \n')
    
    if gitEnabled:
        filesUpdated = git_party_integration.get_status(repo)
        if len(filesUpdated) > 0:
            git_party_integration.git_push(repo, 'Automatic process', filesUpdated)