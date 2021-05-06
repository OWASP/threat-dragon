import logging

# Read Config file
import configparser
config = configparser.ConfigParser()
config.read('config.ini')
urlLog = config['log']['url']

# Set the basic configuration
logging.basicConfig(format='%(asctime)s: %(levelname)s: %(message)s', datefmt='%m/%d/%Y %I:%M:%S')

# Gets or creates a logger
logger = logging.getLogger(__name__)

# define file handler and set formatter
file_handler = logging.FileHandler(urlLog)
formatter = logging.Formatter('%(asctime)s: %(levelname)s: %(message)s','%m/%d/%Y %I:%M:%S')
file_handler.setFormatter(formatter)

# set log level
logger.setLevel(logging.INFO) 

# add file handler to logger
logger.addHandler(file_handler)