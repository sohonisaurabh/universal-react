import os from 'os';
import { createLogger, format, Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export type ServerLoggerType = Logger;

function getLogPrefix() {
  const hostName = os.hostname().toUpperCase();
  const logPrefix = process.env.LOG_PREFIX || 'DEFAULT_PREFIX';
  return `${logPrefix}|${hostName}`;
}

function getRequestIdentifierString({ sessionId }: { sessionId?: string } = {}) {
  return sessionId ? ` [SESSION ID: ${sessionId}]` : '';
}

/**
 * Logger class to fetch instances for logging with custom formatting enabled
 */
export default class LoggerClass {
  private fileName: string;
  private logPrefix: string;
  private transports: DailyRotateFile;
  private sessionId: string;
  private loggerName: string;

  constructor({ fileName = 'logs/error.log' } = {}) {
    this.fileName = fileName;
    this.logPrefix = getLogPrefix();
    this.sessionId = 'defaultSession123$';
    this.loggerName = 'default';

    this.transports = new DailyRotateFile({
      filename: this.fileName,
      zippedArchive: true,
      maxSize: '500m',
      maxFiles: '5',
    });
  }

  getLogger = ({
    sessionId,
    loggerName,
  }: { sessionId?: string; loggerName?: string } = {}): ServerLoggerType => {
    const { combine, timestamp: timeStamp, colorize, printf } = format;
    const loggername = loggerName || this.loggerName;

    const msgFormat = printf(({ level, message, label, timestamp, obj }) => {
      console.log({ level, message, label, timestamp, obj }); //eslint-disable-line
      const { sessionId: sessionGlobal } = this;
      const sessionNumber = sessionId || sessionGlobal;
      return `${timestamp} [${label}] ${level} [${this.logPrefix}] ${getRequestIdentifierString({
        sessionId: sessionNumber,
      })} [${loggername}]: ${message}`;
    });

    const loggerInstance = createLogger({
      level: process.env.LOG_LEVEL || 'error',
      format: combine(timeStamp(), colorize(), msgFormat),
      transports: [this.transports],
    });
    return loggerInstance;
  };
}
