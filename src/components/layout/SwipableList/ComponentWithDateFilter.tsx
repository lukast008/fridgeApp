import React, {useState} from 'react'
import {StyleSheet, View} from 'react-native'
import TopHeader from '../TopHeader/TopHeader'
import SwipableList from "./SwipableList";
import {dateFilterService, DateFilterTypes} from "../../../service/DateFilterService";
import DateFilterDto from "../../../dto/DateFilterDto";

type Props = {
  screenName: string;
  renderData: (filterData: DateFilterDto, searchValue: string) => JSX.Element;
  children?: any;
}

export default function ComponentWithDateFilter(props:Props) {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterType, setFilterType] = useState(dateFilterService.getDefaultFilterType());
  const [searchValue, setSearchValue] = useState("");

  function onPressFilterLeft() {
    setCurrentIndex(currentIndex + 1);
  }

  function onPressFilterRight() {
    if(currentIndex >= 1) setCurrentIndex(currentIndex - 1);
  }

  function renderContent(filterData: DateFilterDto) {
    return props.renderData(filterData, searchValue);
  }

  return (
    <View style={styles.container}>
      <TopHeader
        title={props.screenName}
        isMainScreen={true}
        onSearchChange={setSearchValue}
        hasFilterPanel={true}
        onFilterPressLeft={filterType !== DateFilterTypes.ALL ? onPressFilterLeft : undefined}
        onFilterPressRight={currentIndex > 0 && filterType !== DateFilterTypes.ALL ? onPressFilterRight : undefined}
        dateFilterData={dateFilterService.getFilterData(filterType, currentIndex)}
        onFilterRangeChanged={setFilterType}
      />
      <SwipableList
        currentIndex={currentIndex}
        filterType={filterType}
        onIndexUpdated={setCurrentIndex}
        renderContent={renderContent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop: 24,
  }
})
