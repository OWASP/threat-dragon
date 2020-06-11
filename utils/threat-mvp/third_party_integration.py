# Import Built-In Modules
import json
import sys

# Import Custom Modules
import logger as log
import mail
import requests
from requests.auth import HTTPBasicAuth

# Read Config file
import configparser
config = configparser.ConfigParser()
config.read('config.ini')

# Third party integration
urlIntegration = config['jira']['url']
user = config['jira']['user']
passwd = config['jira']['passwd']


def doRequest(action, url, params="", data=""):
    try:
        auth = HTTPBasicAuth(user, passwd)
        headers = {
            'Accept': 'application/json',
            'Content-type':'application/json'
        }
        
        # Convert data to json send
        obj = json.dumps(data)
        r = requests.request(
            action,
            url,
            headers=headers,
            auth=auth,
            params=params,
            data=obj
        )

        return json.loads(r.text)
    except Exception as e:
        log.logger.error("Exception occurred", exc_info=True)
        mail.sendErrorEmail("Threat Model: Exception occurred in the third party integration", e) 

def create_issue(obj):
    data = doRequest("POST", f'{urlIntegration}/rest/api/2/issue', "", obj)
    return data

def get_issue(issueKey):
    params = {
        'fields': 'status'
    }
    data = doRequest("GET", f'{urlIntegration}/rest/api/2/issue/{issueKey}', params)
    return data