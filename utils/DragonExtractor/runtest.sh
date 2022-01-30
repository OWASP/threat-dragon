#!/bin/sh
#node DragonThreatExtractor.js pj8-7-2020-extract.json  "kpmgjp-kit-its\Sprint 10" > importThis.csv

node DragonThreatExtractor.js "$1" "Work Item Type=Todo" "State=Draft" "Story Points=2" "Value Area= " "Tags=SecurityDesignReview;" "Iteration Path=KITProject\Sprint 10" 


