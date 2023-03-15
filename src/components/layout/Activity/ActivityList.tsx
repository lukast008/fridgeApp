import React, {useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {T1} from "../Text/Text";
import {Icon} from "react-native-elements";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import LoadingIndicator from "../common/LoadingIndicator";
import COLORS from "../../../../assets/colors";
import DateFilterDto from "../../../dto/DateFilterDto";
import {dateFilterService} from "../../../service/DateFilterService";
import ActivityDto from "../../../dto/ActivityDto";
import ActivityItem from "./ActivityItem";
import UndoActivityModal from "../ProductActions/UndoActivityModal";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import DateUtils from "../../../utils/DateUtils";
import {useActivities} from "../../../providers/ActivitiesProvider";

type Props = {
  filterData: DateFilterDto;
  searchValue: string;
}

type DataRow = {
  header?: string;
  activity?: ActivityDto;
}

const ViewTypes = {
  ACTIVITY: 0,
  HEADER: 1,
};

const { width } = Dimensions.get("window");

const getListDataProvider = new DataProvider((r1: DataRow, r2: DataRow) => {
  if(r1.activity && r2.activity) return r1.activity !== r2.activity;
  else return r1.header !== r2.header;
});

export default function ActivityList(props:Props) {

  const { t } = useDefaultTranslation("activity");
  const activities = useActivities(props.filterData, "actionDate", true, props.searchValue);
  const [selectedActivity, setSelectedActivity] = useState<ActivityDto>();
  const [listDataProvider, setListDataProvider] = useState<DataProvider | null>(null);
  const [dataRows, setDataRows] = useState<DataRow[]>([]);

  useEffect(() => {
    const rvActivities = prepareActivities(activities);
    setDataRows(rvActivities || []);
    setListDataProvider(rvActivities ? getListDataProvider.cloneWithRows(rvActivities) : null);

    return () => {
      setListDataProvider(null);
    }
  }, [activities]);

  function onBackdrop() {
    setSelectedActivity(undefined);
  }

  const getLayoutProvider = useMemo(() => {
    return new LayoutProvider(
      index => dataRows[index] && dataRows[index].activity ? ViewTypes.ACTIVITY : ViewTypes.HEADER,
      (type, dim) => {
        if(type === ViewTypes.HEADER) {
          dim.width = width;
          dim.height = 40;
        } else {
          dim.width = width;
          dim.height = 60;
        }
      }
    )
  }, [dataRows]);

  function prepareActivities(activities: ActivityDto[] | null) {
    if(!activities) return null;
    let rvActivities: DataRow[] = [];
    const shouldRenderSectionHeader = dateFilterService.getShouldRenderSectionHeader(props.filterData);
    let prevDayLabel = "";
    activities.forEach(a => {
      if(shouldRenderSectionHeader) {
        const dayLabel = DateUtils.convertDateToDayString(a.actionDate);
        if(dayLabel !== prevDayLabel) rvActivities.push({header: dayLabel});
        prevDayLabel = dayLabel;
      }
      rvActivities.push({activity: a});
    });
    return rvActivities;
  }

  function renderEmptyList() {
    return (
      <View style={styles.emptyListContainer}>
        <T1 style={{textAlign: "center"}}>{t("emptyInfo")}</T1>
        <Icon name={'folder-open'} size={50}/>
      </View>
    )
  }

  function renderSectionHeader(title?: string) {
    return <T1 style={styles.title}>{title}</T1>;
  }

  function renderItem(item: ActivityDto) {
    return (
      <TouchableOpacity key={item._id} style={styles.itemContainer} onPress={() => setSelectedActivity(item)}>
        <ActivityItem activity={item} />
      </TouchableOpacity>
    );
  }

  function rowRenderer(type: any, data: DataRow) {
    return data.activity ? renderItem(data.activity) : renderSectionHeader(data.header);
  }

  if(listDataProvider === null) return <LoadingIndicator txt={t("loadingInfo")}/>
  else if(listDataProvider.getSize() === 0 ) return renderEmptyList();
  else {
    return (
      <View style={styles.container}>
        <RecyclerListView
          dataProvider={listDataProvider}
          layoutProvider={getLayoutProvider}
          rowRenderer={rowRenderer}
        />
        <UndoActivityModal onBackDropPress={onBackdrop} activity={selectedActivity} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyListContainer: {
    margin: 30,
    alignItems: "center",
  },
  title: {
    color: COLORS.textLight,
    backgroundColor: COLORS.disabled,
    textAlign: "center",
    padding: 5,
    height: 40,
    textAlignVertical: "center"
  },
  itemContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: COLORS.background,
    borderColor: COLORS.disabled,
  }
})
