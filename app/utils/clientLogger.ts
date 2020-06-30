export type ClientLoggerType = {
  [key: string]: Function;
};
type ConsoleLevels = 'log' | 'info' | 'warn' | 'error';

export default class Logger {
  private levels: Array<string>;
  private level: string;

  constructor() {
    this.levels = ['log', 'info', 'warn', 'error'];
    this.level = process.env.LOG_LEVEL || 'error';
  }

  getLogger(): ClientLoggerType {
    let levelFound = false;
    const logger: ClientLoggerType = {};

    this.levels.forEach(currentLevel => {
      if (currentLevel === this.level || levelFound) {
        levelFound = true;
        logger[currentLevel] = console[currentLevel as ConsoleLevels]; //eslint-disable-line
      } else {
        logger[currentLevel] = () => {};
      }
    });
    return logger;
  }
}
