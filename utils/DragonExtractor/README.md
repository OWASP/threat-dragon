*Threat Dragon Extractor*

The goal of the Threat Dragon extractor is to effectively turn your expensive 
threat model into "source code" for security testing. 

The tool will:
-Convert a threat model into CSV
-Merge key=value pairs from command line as constants in "key" column
-Import into Azure DevOps or Jira as trackable testing artifacts for your team

Benficial side effects:
-Encourages threat model updates as it drives testing
-Avoids hours of work transcribing into documents and test artifacts

Workflow:

-Create Threat model with developers, testers, and product team
-Carefully think about diagram; model names (increases artifact subject lenth)
-Think about what Labels (Jira) or Tags (DevOps) can help you track testing
-Export similar ToDos from Jira/ADO to CSV to understand necessary columns
-Incorporate organization and project specific columns into CLI arguments
-Track testing as you normally would through DevOps or Jira (or other system)

An example CLI for our team:

 node ExtractThreats.js data/pj8-7-2020-extract.json "Work Item Type=Todo" 
 "State=Draft" "Story Points=2" "Value Area= " "Tags=SecurityDesignReview;"
 "Iteration Path=kpmgjp-kit-its\Sprint 10" > import.csv

Notes:
-Sprint information, initial state, artifact type; all can be created
-Mandatory fields such as "Story Points" while temporarily inaccurate may 
unblock import
-"Tags" or "Labels" column includes threat STRIDE keyword separted by space;
"Tags = " or "Labels = " (blank value) will JUST include STRIDE key word








