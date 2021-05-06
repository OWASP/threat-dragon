# Integration Threat Modeling with Jira

# Product Vision:
This project aims to have a greater visibility of the possible threats and a better tracking of the actions we take to mitigate them.

# Key Goals:

- TM data generated automatically within the backlog of each project.
- Dual sync between Threat Dragon and project management.

## Prerequisite

- You need to install requests library for python: pip install requests
- You need to add credentials in config.ini file

## Run the code

- To run the code:

`python3 itmj.py [path threat dragon file] [key project] [epic project]`

- Example:

`python3 itmj.py td_json/test1.json ITMJ ITMJ-2`
