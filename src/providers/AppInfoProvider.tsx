import React, {useContext, useEffect, useMemo} from "react";
import {UpdateMode} from "realm";
import {openLocalAppInfoRealm} from "../database/appInfo/appInfoRealm";
import LogDto, {cloneLogDto} from "../dto/AppInfo/LogDto";
import LogModel from "../database/appInfo/LogModel";
import LoggerService from "../service/LoggerService";
import UuidUtils from "../utils/UuidUtils";
import LogFilterDto from "../dto/AppInfo/LogFilterDto";
import DateUtils from "../utils/DateUtils";

const REMOVE_LOGS_OLDER_THAN_DAYS = 7;

export type AppInfoType = {
  saveLog: (log: LogDto) => void;
  fetchLogs: (logFilter: LogFilterDto) => Promise<LogDto[]>;
  clearLogs: () => void;
  sessionId: string;
}

const AppInfoContext = React.createContext<AppInfoType | null>(null);

function AppInfoProvider({children}: any) {

  const sessionId = useMemo(() => UuidUtils.generateId(), []);
  useEffect(() => removeOldLogs(), []);

  const saveLog = async (log: LogDto) => {
    const realm = await openLocalAppInfoRealm();
    if(log.level !== 'DEBUG') console.log(log.toString());
    realm.write(() => {
      realm.create(LogModel.schema.name, log, UpdateMode.Never)
    });
  }

  const fetchLogs = (logFilter: LogFilterDto) => {
    return openLocalAppInfoRealm().then(realm => {
      let logs = realm.objects<LogDto>(LogModel.schema.name)
        .sorted('timestamp', logFilter.sortingOrder === 'DESC');
      if(logFilter.onlyCurrentSession) logs = logs.filtered("sessionId = $0", sessionId);
      logs = logs.filtered("timestamp > $0 AND timestamp <= $1", logFilter.startDate, logFilter.endDate);
      return [...logs].map(logDto => cloneLogDto(logDto));
    });
  }

  const clearLogs = () => {
    openLocalAppInfoRealm().then(realm => {
      realm.write(() => realm.delete(realm.objects(LogModel.schema.name)));
    });
  }

  const removeOldLogs = () => {
    openLocalAppInfoRealm().then(realm => {
      const date = DateUtils.addDaysToDate(new Date(), -REMOVE_LOGS_OLDER_THAN_DAYS);
      let logs = realm.objects<LogDto>(LogModel.schema.name).filtered("timestamp <= $0", date);
      console.log(`remove ${logs.length} logs older than: `, date);
      realm.write(() => realm.delete(logs));
    });
  }

  return (
    <AppInfoContext.Provider value={{ saveLog, fetchLogs, clearLogs, sessionId }}>
      {children}
    </AppInfoContext.Provider>
  );
}

let defaultLogger: LoggerService;
const useLogger = (context: string) => {
  const appInfoContext = useContext(AppInfoContext);
  if(appInfoContext == null) {
    throw new Error("useAppInfo() called outside of an AppInfoProvider?");
  }
  if(!defaultLogger) defaultLogger = new LoggerService('Default', appInfoContext);
  return { logger: new LoggerService(context, appInfoContext) };
}

export { AppInfoProvider, useLogger, defaultLogger };
