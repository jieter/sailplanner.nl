const path = require('path');
const fs = require('fs');

const downloadDir = '/tmp/downloads/';

exports.config = {
    runner: 'local',
    specs: ['./wdio/test-*.js'],
    maxInstances: 1,

    capabilities: [
        {
            maxInstances: 1,
            browserName: 'chromium',
            chromeOptions: {
                prefs: {
                    download: {
                        default_directory: downloadDir,
                    },
                },
            },

            'goog:chromeOptions': {
                headless: process.argv.includes('--headless'),
                prefs: {
                    download: {
                        directory_upgrade: true,
                        prompt_for_download: false,
                        default_directory: downloadDir,
                    },
                    browser: {
                        setDownloadBehavior: {
                            behavior: 'allow',
                            downloadPath: downloadDir,
                        },
                    },
                },
            },
        },
    ],
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'info',
    baseUrl: 'http://localhost:8000/',
    // Default request retries count
    connectionRetryCount: 3,
    waitforTimeout: 5000,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: ['chromedriver'],

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'mocha',
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Delay in seconds between the spec file retry attempts
    // specFileRetriesDelay: 0,
    //
    // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter.html
    reporters: ['spec'],
    //
    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },

    onPrepare: () => {
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir);
        }
    },
    onComplete: () => {
        // fs.rmdirSync(downloadDir, { recursive: true });
    },
};
