import json

# Import Custom Modules
import logger as log
import mail
import third_party_integration

# We use this method to ask for threats that are already marked as mitigated in threat dragon
def handleTitle(threatTitle, threatStatus):
    titleInJira = ""
    if threatStatus == "Mitigated":
        titleInJira = "[TO CLOSE] - " + threatTitle
    else:
        titleInJira = threatTitle
    return titleInJira

# Concatenate description and mitigation
def handleDescription(description, mitigation):
    return description + "\n\n" + mitigation

# Check if we have a new issue for Jira
def checkDescription(description):
    # return first occurrence of [ ]
    beginTag = description.find('[') 
    endTag = description.find(']') 

    if beginTag != -1 and endTag != -1:
        issueKey = description[beginTag+1:endTag]
        if len(issueKey) > 0:
            return issueKey    
        else:
            issueKey = "New"
            return issueKey
    else:
        issueKey = "New"
        return issueKey


# Matching the Severety to set up the Priority
def handleSeverity(severity):
    switcher = { 
		"High": "Major", 
		"Medium": "Normal", 
		"Low": "Minor", 
	}
    return switcher.get(severity, "Normal")

# Check if we have the Jira Epic
def checkTitle(title):
    outcome = False

    # return first occurrence of [ ]
    beginTag = title.find('[') 
    endTag = title.find(']') 

    if beginTag != -1 and endTag != -1:
        global projectJiraKey
        global epicJiraKey

        epicJiraKey = title[beginTag+1:endTag]

        if len(epicJiraKey) > 0:
            beginDash = title.find('-')
            if beginDash != -1:
                projectJiraKey = epicJiraKey[0:beginDash-1]
                if len(projectJiraKey) > 0:
                    outcome = True

    return outcome

# Parse the dictionary to generate a JSON used to call the Jira API
def parseJson(obj, threatJasonPath):
    try:
        global projectJiraKey
        global epicJiraKey
        processJSON = False
        receiver = []

        # Check if we have the emails of the owner and reviewer
        if 'summary' in obj and 'owner' in obj['summary']:
            receiver.append(obj['summary']['owner'])
        else:    
            receiver.append("")

        if 'detail' in obj and 'reviewer' in obj['detail']:
            receiver.append(obj['detail']['reviewer'])
        else:    
            receiver.append("")

        receiver = ','.join(filter(None, receiver))


        # Process the JSON files
        for (i) in obj['detail']['diagrams']:
            
            # Check if we have JSON files from Threat Dragon with a Jira key
            processJSON = checkTitle(i['title'])

            if processJSON:
                log.logger.info(f'Start processing {threatJasonPath} :: {projectJiraKey} (Jira) :: {epicJiraKey} (Epic) ')

                for (j) in i['diagramJson']['cells']:
                    print("ID: " + j['id'])
                    print("Type: " + j['type'])

                    # We need to exclude boundary types?
                    if j['type'] != 'tm.Boundary':
                        # We have examples with id and not with ruleId
                        if 'threats' in j:
                            print("Has Threats: yes")
                        
                            for (k) in j['threats']:

                                finalDesc = "No description"
                                if 'description' in k:
                                    finalDesc = k['description']
                                else:
                                    k['description'] = ""

                                finalMiti = "No Mitigation"
                                if 'mitigation' in k:
                                    finalMiti = "Mitigation:\n" + k['mitigation']

                                strJiraKey = checkDescription(finalDesc)

                                if strJiraKey == "New":
                                    lblType = "STRIDE-" + k['type'].replace(" ", "_")

                                    titleInJira = handleTitle(k['title'], k['status'])

                                    jsonJira =  {
                                        "fields":{
                                            "project":{
                                                "key": projectJiraKey
                                            },
                                            "summary": titleInJira,
                                            "description": handleDescription(finalDesc, finalMiti),
                                            "issuetype":{
                                                "name":"Story"
                                            },
                                            "customfield_10002": epicJiraKey,
                                            "labels":[
                                                "Threat",
                                                lblType
                                            ],
                                            "priority":{
                                                "name": handleSeverity(k['severity'])
                                            }
                                        }
                                    }

                                    # Function to create issues
                                    res = third_party_integration.create_issue(jsonJira)

                                    # Check if the call was successful to insert the issue key
                                    if 'errorMessages' in res:
                                        log.logger.error(f"Request has failed for {titleInJira}")
                                        if len(res['errorMessages']) > 0:
                                            log.logger.error(f"{res['errorMessages']}") 
                                        else:
                                            log.logger.error(f"{res['errors']}") 
                                    else:
                                        k['description'] = '[' + res['key'] + '] '+ k['description']

                                else:
                                    if k['status'] != "Mitigated":
                                        # Function to get issues
                                        res = third_party_integration.get_issue(strJiraKey)

                                        # Check if the call was successful to update the status to Mitigated
                                        if 'errorMessages' in res:
                                            log.logger.error(f"Request has failed for {strJiraKey}")
                                            if len(res['errorMessages']) > 0:
                                                log.logger.error(f"{res['errorMessages']}") 
                                            else:
                                                log.logger.error(f"{res['errors']}") 
                                        else:
                                            if res['fields']['status']['name'] == 'Closed':
                                                k['status'] = 'Mitigated'

                                                # Sending emails
                                                subject = "Threat Model Security - Threat closed"
                                                body = f"{projectJiraKey} - {k['description']} was closed."
                                                mail.sendEmail(subject, body, receiver)

                                if k['status'] != "Mitigated":
                                    print(json.dumps(res, sort_keys=True, indent=4, separators=(",", ": ")))
                                    print("")

                        else:
                            print("Has Threats: No")
                    print('')
                    
                print('')
                print('---------------')

                # Save the changes to JSON file
                JSON_file = open(threatJasonPath, 'w+') 
                JSON_file.write(json.dumps(obj, indent=2))
                JSON_file.close()
        
            else:
                log.logger.info(f'Start processing {threatJasonPath} ')
                log.logger.info(f'Missing Jira Key in the Threat Model diagram.')

    except Exception as e:
        log.logger.error("Exception occurred", exc_info=True)        
        log.logger.info(f'Finish processing \n')
        mail.sendErrorEmail("Threat Model: Exception occurred parsing the JSON file", e)
        raise e

