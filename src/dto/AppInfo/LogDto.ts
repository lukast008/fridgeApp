import COLORS from "../../../assets/colors";
import {ObjectId} from "bson";

export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

export default class LogDto {
  _id: ObjectId;
  timestamp: Date;
  level: LogLevel;
  context: string;
  message: string;
  sessionId: string;
  color: string;

  constructor(level: LogLevel, context: string, message: string, sessionId: string) {
    this._id = new ObjectId();
    this.timestamp = new Date();
    this.level = level;
    this.context = context;
    this.message = message;
    this.sessionId = sessionId;
    this.color = resolveColor(level);
  }

  toString = () => {
    return `=====  [${this.level}] - ${this.context} - ${this.message}`;
  }
}

const resolveColor = (level: LogLevel) => {
  if (level === 'ERROR') return COLORS.logError;
  if (level === 'WARN') return COLORS.logWarn;
  if (level === 'INFO') return COLORS.logInfo;
  return COLORS.logDebug;
}

export const cloneLogDto = (log: LogDto): LogDto => {
  return {
    _id: log._id,
    timestamp: log.timestamp,
    level: log.level,
    context: log.context,
    message: log.message,
    sessionId: log.sessionId,
    color: resolveColor(log.level)
  }
}

