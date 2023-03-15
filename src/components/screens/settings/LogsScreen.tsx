import React, {useEffect, useState} from 'react'
import {FlatList} from 'react-native'
import TopHeader from "../../layout/TopHeader/TopHeader";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import LogDto from "../../../dto/AppInfo/LogDto";
import {T2} from "../../layout/Text/Text";
import {ScreenContainer} from "../../layout/common/Containers";
import {useLogger} from "../../../providers/AppInfoProvider";
import styled from "styled-components/native";
import {usePopup} from "../../../providers/PopupProvider";
import LogFilterDto from "../../../dto/AppInfo/LogFilterDto";
import LogDetailsModal from "../../layout/modals/logs/LogDetailsModal";
import LogListItem from "../../layout/Logs/LogListItem";
import LogFiltersModal from "../../layout/modals/logs/LogFiltersModal";
import Share from "react-native-share";
import {openLocalAppInfoRealm} from "../../../database/appInfo/appInfoRealm";

const LogsHeader = styled(T2)`
  align-items: center;
  padding: 5px 10px;
`;

export default function LogsScreen() {

  const { t } = useDefaultTranslation('logs');
  const { openPopup, closePopup } = usePopup();
  const { logger } = useLogger('LogsScreen');
  const [logs, setLogs] = useState<LogDto[] | null>(null);
  const [logFilter, setLogFilter] = useState(new LogFilterDto(true));

  useEffect(() => {
    logger.fetchLogs(logFilter).then(result => setLogs(result));
  }, [logFilter]);

  const renderItem = ({ item }: { item: LogDto }) => {
    return <LogListItem item={item} onLogItemPress={onLogItemPress} />;
  }

  const renderHeader = () => {
    if(!logs || logs.length === 0) return <LogsHeader>{t("no-results")}</LogsHeader>
    return <LogsHeader>{t("list-header", {n: logs.length})}</LogsHeader>
  }

  const onClearPress = () => {
    openPopup({
      title: t("confirm-clear.title"),
      content: t("confirm-clear.content"),
      closeOnDismiss: true,
      buttons: [
        { label: t("common:no"), onPress: closePopup },
        { label: t("common:yes"), onPress: handleClearLogs }
      ],
    });
  }

  const onFilterPress = () => {
    openPopup({
      title: t("filter.title"),
      content: <LogFiltersModal logFilter={logFilter} onChanged={onFiltersChanged} />,
      closeOnDismiss: true,
      buttons: [],
    });
  }

  const onSharePress = () => {
    exportLogsDb()
      .then(() => console.log("Logs exported successfully"))
      .catch(e => console.log("Failed to export logs: ", e));
  }

  const onLogItemPress = (logDto: LogDto) => {
    openPopup({
      content: <LogDetailsModal logDto={logDto} />,
      closeOnDismiss: true,
      buttons: [
        { label: t("common:ok"), onPress: closePopup },
      ],
    });
  }

  const handleClearLogs = () => {
    logger.clearLogs();
    setLogs(null);
  }

  const onFiltersChanged = (logFilter: LogFilterDto) => {
    setLogFilter(logFilter);
    closePopup();
  }

  async function exportLogsDb() {
    const realm = await openLocalAppInfoRealm();
    await Share.open({
      title: t("export.title"),
      message: t("export.message"),
      url: "file://" + realm.path,
      subject: t("export.title"),
    });
  }

  return (
    <ScreenContainer>
      <TopHeader
        title={t("header")}
        isMainScreen={false}
        onClearPress={onClearPress}
        onSettingsPress={onFilterPress}
        onSharePress={onSharePress}
      />
      {renderHeader()}
      <FlatList
        data={logs}
        renderItem={renderItem}
        keyExtractor={item => item._id.toString()}
        keyboardShouldPersistTaps={"always"}
      />
    </ScreenContainer>
  )
}
