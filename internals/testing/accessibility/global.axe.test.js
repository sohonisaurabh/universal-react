const AxeBuilder = require('axe-webdriverjs');
const WebDriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { logViolation, logError, logSuccess } = require('./util');
const { urls, totalViolationsThreshold, pageLevelViolationsThreshold } = require('./config.axe');

let host = 'localhost';

const screen = {
  width: 1024,
  height: 768
};

if (process.env.TESTSERVER_HOST) {
  host = process.env.TESTSERVER_HOST;
}

const chromeOpt = new chrome.Options().headless().windowSize(screen);
const driver = new WebDriver.Builder()
  .forBrowser('chrome') //TODO: Has to be configurable
  .setChromeOptions(chromeOpt)
  .build();

/**
 * Closes the browser with an option of exiting the process
 *
 * @param {Object} driver - Webdriver instance
 * @param {Object} thresholdExceeded - Is the violation threshold exceeded ?
 */
const stop = async ({ driver, thresholdExceeded = false }) => {

  await driver.close();

  if (thresholdExceeded) {
    process.exit(1);
  }

  return false;
}

/**
 * Run accessibility tests using the webdriver instance
 *
 * @param {Object} driver - Webdriver instance
 * @param {Object} url - Current URL
 */
const runTests = (driver, url) => {

  return new Promise((resolve, reject) => {
    AxeBuilder(driver).analyze((err, results) => {

      if (err) {
        reject({ err });
        return;
      }

      const violations = results.violations;
      if (!violations[0]) {
        resolve(0)
        return;
      }

      const issueCount = violations.reduce(logViolation, 0);

      if (issueCount > pageLevelViolationsThreshold) {
        reject({
          err: 'Page treshold crossed',
          pageThresholdExceeded: true,
          issueCount
        });
        return;
      };

      resolve(issueCount);
    });
  })
}

/**
 * Run accessibility tests using the webdriver instance
 *
 * @param {Object} driver - Webdriver instance
 * @param {Array} urls - URL's to be traversed
 * @param {Function} runTests - Function instance to run aXe accessibility tests
 * @param {Number} totalViolationsThreshold - Threshold for accessibility issues after which the node process exits.
 */
(async ({ driver, urls, runTests, totalViolationsThreshold }) => {

  let violationCount = 0;
  let url = '';

  for (relativeUrl of urls) {
    url = `https://${host}.com${relativeUrl}`;

    await driver.get(url);

    violationCount += await runTests(driver, url).catch(({ err, pageThresholdExceeded, issueCount }) => {
      if (pageThresholdExceeded) {
        logError(`\n Pagelevel Threshold of ${pageLevelViolationsThreshold} crossed for ${url}. Violations count: ${issueCount}`);
        stop({ driver, thresholdExceeded: true });
        return;
      } else {
        logError(err);
        stop({ driver });
        return;
      }
    });

    if (violationCount > totalViolationsThreshold) {
      logError(`\n Total Threshold of ${totalViolationsThreshold} crossed.
                  Total violations count: ${violationCount}`);
      stop({ driver, thresholdExceeded: true });
      return;
    }
  }

  logSuccess(`\n Total violations count: ${violationCount}`);
  stop({ driver, violationCount });

}) ({ driver, urls, runTests, totalViolationsThreshold });


