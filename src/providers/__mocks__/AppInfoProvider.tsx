import LoggerService from "../../service/LoggerService";
import {AppInfoType} from "../AppInfoProvider";

export const useLogger = (context: string) => {
  const appInfoContext: AppInfoType = {
    saveLog: jest.fn(),
    fetchLogs: jest.fn(),
    clearLogs: jest.fn(),
    sessionId: ""
  }
  return { logger: new LoggerService(context, appInfoContext) };
}
