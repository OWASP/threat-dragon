import logger as log
import mail
import json

def read_json(threatJasonPath):
    try:
        # read the Threat Dragon JSON file 
        JSON_file = open(threatJasonPath, 'r') 
        dataTM = JSON_file.read()
        JSON_file.close()

        # return a dictionary
        obj = json.loads(dataTM)
        return obj
   
    except FileNotFoundError as e2:
         log.logger.error("File not accessible")
         mail.sendErrorEmail("Threat Model: Exception occurred reading the JSON file", e)  
         log.logger.info(f'Finish processing \n')
         raise e2
    except Exception as e:
         log.logger.error("Exception occurred", exc_info=True)
         mail.sendErrorEmail("Threat Model: Exception occurred reading the JSON file", e)  
         log.logger.info(f'Finish processing \n')
         raise e