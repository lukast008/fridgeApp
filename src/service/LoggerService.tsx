import {AppInfoType} from "../providers/AppInfoProvider";
import LogDto, {LogLevel} from "../dto/AppInfo/LogDto";
import LogFilterDto from "../dto/AppInfo/LogFilterDto";

class LoggerService {
  context: string;
  appInfoContext: AppInfoType;

  constructor(context: string, appInfoContext: AppInfoType) {
    this.context = context;
    this.appInfoContext = appInfoContext;
  }

  info = (message: string, data?: Object) => this.saveLog("INFO", message, data);
  debug = (message: string, data?: Object) => this.saveLog("DEBUG", message, data);
  warn = (message: string, data?: Object) => this.saveLog("WARN", message, data);
  error = (message: string, data?: Object) => this.saveLog("ERROR", message, data);

  private saveLog = (level: LogLevel, message: string, data?: Object) => {
    const msg = data ? message + "\n" + JSON.stringify(data, null, 2) : message;
    this.appInfoContext.saveLog(new LogDto(level, this.context, msg, this.appInfoContext.sessionId));
  }

  fetchLogs = (logFilter: LogFilterDto) => this.appInfoContext.fetchLogs(logFilter);
  clearLogs = () => this.appInfoContext.clearLogs();
}

export default LoggerService;
