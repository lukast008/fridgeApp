import React from 'react'
import {StyleSheet, View} from 'react-native'
import ActivityList from "../layout/Activity/ActivityList";
import ComponentWithDateFilter from "../layout/SwipableList/ComponentWithDateFilter";
import {useDefaultTranslation} from "../../utils/TranslationsUtils";
import DateFilterDto from "../../dto/DateFilterDto";

export default function ActivityScreen() {

  const { t } = useDefaultTranslation('activity');

  function renderData(filterData: DateFilterDto, searchValue: string) {
    return(
      <View style={styles.content}>
        <ActivityList
          filterData={filterData}
          searchValue={searchValue}/>
      </View>
    )
  }

  return (
    <ComponentWithDateFilter
      screenName={t("header")}
      renderData={renderData}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  }
})
