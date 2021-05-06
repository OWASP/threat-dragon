# Local SMTP debugging server
#python -m smtpd -c DebuggingServer -n localhost:1025

import logger as log
import smtplib
from socket import gaierror
 
# Read Config file
import configparser
config = configparser.ConfigParser()
config.read('config.ini')

def sendErrorEmail(subject, body):
    try:    
        receiver = ""
        sendEmail(subject, body, receiver)

    except Exception as e:
        log.logger.info('The sending of the email was failure.')

def sendEmail(subject, body, receiver):
    try: 
        emailEnable = config['email']['sendingEmails']
        sendingEmails = str(emailEnable).lower() in ("yes", "true")

    except Exception as e:
        sendingEmails = False
    
    try:    
        if sendingEmails:
            port = config['email']['port']
            smtp_server = config['email']['smtp_server']
            login = config['email']['login']
            password = config['email']['password']
            sender = config['email']['sender']

            if len(receiver) == 0:
                receiver = sender

            # The subject, to and from emails, the message body
            message = f"""\
            Subject: {subject}
            To: {receiver}
            From: {sender}
            {body}"""

            # Send the email using the credentials
            try:
                with smtplib.SMTP(smtp_server, port) as server:
                    server.sendmail(sender, receiver, message)
            except (gaierror, ConnectionRefusedError):
                log.logger.error("Failed to connect to the server. Bad connection settings")
            except smtplib.SMTPServerDisconnected:
                log.logger.error("Failed to connect to the server")
            except smtplib.SMTPException as e:
                log.logger.error(f"SMTP error occurred: {e}") 
            else:
                log.logger.info("The email was sent successfully")
        else:
            log.logger.info('The sending of emails is disable.')

    except Exception as e:
        log.logger.info('The sending of emails is disable.')