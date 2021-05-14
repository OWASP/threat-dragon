const path = require('path')
const deepmerge = require('deepmerge')
const chromedriver = require('chromedriver')

const startHeadless = true;
const concurrentMode = true;
const userOptions = JSON.parse(process.env.VUE_NIGHTWATCH_USER_OPTIONS || '{}')
const chromeArgs = []
const geckoArgs = []

// user may have not installed geckodriver
let geckodriver = {}
try {
  geckodriver = require('geckodriver')
} catch (e) {}

if (startHeadless) {
  chromeArgs.push('headless')
  geckoArgs.push('--headless')
}

const defaultSettings = {
  src_folders: ['tests/e2e/specs'],
  output_folder: 'tests/e2e/reports/junit',
  page_objects_path: 'tests/e2e/page-objects',
  custom_assertions_path: 'tests/e2e/custom-assertions',
  custom_commands_path: '',
  test_workers: concurrentMode,

  test_settings: {
    default: {
      launch_url: 'http://localhost:3000/',
      detailed_output: !concurrentMode,
      globals: {
        waitForConditionTimeout: 5000,
      },
    },
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          w3c: false,
          args: chromeArgs,
          args: [
              '--disable-gpu',
              'window-size=1920,1080',
              '--incognito'
          ]
        },
      },
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        alwaysMatch: {
          acceptInsecureCerts: true,
          'moz:firefoxOptions': {
            args: geckoArgs,
          },
        },
      },
      webdriver: {},
    },
  },
}
const baseSettings = deepmerge(defaultSettings, webdriverServerSettings())
module.exports = deepmerge(baseSettings, adaptUserSettings(userOptions))

function adaptUserSettings(settings) {
  // The path to nightwatch external globals file needs to be made absolute
  // if it is supplied in an additional config file, due to merging of config files
  if (settings.globals_path) {
    settings.globals_path = path.resolve(settings.globals_path)
  }

  return settings
}

function webdriverServerSettings() {
  return {
    selenium: {
      start_process: false,
      host: 'hub-cloud.browserstack.com',
      port: 443,
      cli_args: {
        'webdriver.chrome.driver': chromedriver.path,
        'webdriver.gecko.driver': geckodriver.path,
      },
    },
    test_settings: {
      default: {
        desiredCapabilities: {
          'browserstack.user':
            process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
          'browserstack.key':
            process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
          build: process.env.BROWSERSTACK_BUILD || 'default_build',
          project: process.env.BROWSERSTACK_PROJECT || 'default_project',
          'browserstack.debug': true,
          'browserstack.local': true,
        },
      },
      chrome: {
        desiredCapabilities: {
          'browserstack.user':
            process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
          'browserstack.key':
            process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
          build: process.env.BROWSERSTACK_BUILD || 'default_build',
          project: process.env.BROWSERSTACK_PROJECT || 'default_project',
          'browserstack.debug': true,
          'browserstack.local': true,
        },
      },
    },
  }
}
