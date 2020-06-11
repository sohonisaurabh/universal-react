interface nextJSProcess extends NodeJS.Process {
  browser: boolean;
}
import clientLogger from './clientLogger';
import serverLogger from './serverLogger';

let logger: clientLogger | serverLogger;

if ((process as nextJSProcess).browser) {
  logger = new clientLogger();
} else {
  logger = new serverLogger();
}

export default logger;
