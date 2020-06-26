interface nextJSProcess extends NodeJS.Process {
  browser: boolean;
}

import { ServerLoggerType } from './serverLogger';
import { ClientLoggerType } from './clientLogger';

const clientLogger = './clientLogger';
const serverLogger = './serverLogger';

type Logger = ClientLoggerType | ServerLoggerType;
let logger: Logger = {};

if ((process as nextJSProcess).browser) {
  import(clientLogger).then(logFactory => {
    console.log('logFactory is---', logFactory);
    logger = logFactory.getLogger();
  });
} else {
  import(serverLogger).then(logFactory => {
    console.log('logFactory is---', logFactory);
    logger = logFactory.getLogger();
  });
}

export default logger;
