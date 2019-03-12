const colors = require('colors');

const link = colors.underline.blue;
const error = colors.red.bold;
const info = colors.yellow;
const success = colors.green;


const logger = (...args) => {
  console.log(...args);
};

const logError = (msg) => {
  logger(error(msg));
}

const logSuccess = (msg) => {
  logger(success(msg));
}

const selectorToString = (selectors, separator) => {
  separator = separator || ' ';
  return selectors
    .reduce((prev, curr) => prev.concat(curr), [])
    .join(separator);
};

const getViolationReferences = (nodes = []) => {
  return nodes.map(node => `     ->   ${selectorToString(node.target)} \n`).join('');
}

const logViolation = (count, violation) => {

  const violationDetail = error(`\n  "${violation.id}" rule violated with ${violation.nodes.length} occurrence(s)!\n`) +
    info(`    TEST: ${violation.description}.\n`) +
    info(`    HELP: ${violation.help}.\n`) +
    `     Elements reference:\n${getViolationReferences(violation.nodes)}` +
    `     For more details: ${link(violation.helpUrl.split('?')[0])}`;

  logger(violationDetail);

  return count + violation.nodes.length;
}


module.exports = {
  logViolation,
  logError,
  logSuccess
}
