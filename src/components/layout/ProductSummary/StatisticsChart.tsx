import React, {useEffect, useRef, useState} from 'react'
import {Dimensions, GestureResponderEvent, ScrollView, StyleSheet, View} from "react-native";
import StatisticsDto from "../../../dto/StatisticsDto";
import {ProductActions} from "../../../data/productActionsData";
import COLORS from "../../../../assets/colors";
import {dateFilterService, DateFilterTypes} from "../../../service/DateFilterService";
import ActivityDto from "../../../dto/ActivityDto";
import {statisticsService} from "../../../service/StatisticsService";
import {LineChart} from "react-native-chart-kit";
import StatisticsChartDto from "../../../dto/StatisticsChartDto";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: COLORS.background,
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: COLORS.background,
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

const columnsToDisplay = 7;

type Props = {
  statistics: StatisticsDto;
}

export default function StatisticsChart(props: Props) {

  const [chartScrollIdx, setChartScrollIdx] = useState(0);
  const [chartData, setChartData] = useState<StatisticsChartDto | null>(null);
  const prevPosX = useRef(0);
  const scrollIdxRef = useRef(0);

  useEffect(() => {
    const dateFilter = dateFilterService.getFilterData(DateFilterTypes.WEEK, 0);
    const activities: ActivityDto[] = props.statistics.activitiesByType.get(ProductActions.ADD) || [];
    const chartDto = statisticsService.getChartData(activities, dateFilter);
    statisticsService.getGroupedChartData(activities, dateFilter);
    console.log("chartDto: ", chartDto);
    setChartData(chartDto);
  }, [])

  function onTouchStart(event: GestureResponderEvent) {
    console.log("onTouchStart: " + event.nativeEvent.locationX);
    prevPosX.current = event.nativeEvent.locationX;
  }

  function onTouchEnd(event: GestureResponderEvent) {
    console.log("onTouchEnd");
    prevPosX.current = 0;
  }

  function onTouchMove(event: GestureResponderEvent) {
    //console.log("onTouchMove: ", event.nativeEvent.locationX);
    const posX = event.nativeEvent.locationX;
    if(prevPosX.current === 0) prevPosX.current = posX;
    if(Math.abs(prevPosX.current - posX) > 10) {
      //console.log("prevPosX: " + prevPosX.current + ", posX: " + posX);
      if(prevPosX.current > posX) onSwipeLeft();
      else onSwipeRight();
      prevPosX.current = posX;
    }
  }

  function onSwipeLeft() {
    console.log("onSwipeLeft");
    if(scrollIdxRef.current > 0) scrollIdxRef.current--;
    if(chartScrollIdx > 0 ) setChartScrollIdx(chartScrollIdx - 1);
  }

  function onSwipeRight() {
    console.log("onSwipeRight");
    setChartScrollIdx(chartScrollIdx + 1);
    scrollIdxRef.current++;
  }

  function renderChart (statistics: StatisticsDto, dateFilterType: string) {
    if(chartData) {
      console.log("\n\n ************** RENDER CHART ***************");
      const dataLen = chartData.data.length;
      let startIdx = dataLen - columnsToDisplay - scrollIdxRef.current;
      if(startIdx < 0) startIdx = 0;
      const endIdx = startIdx + columnsToDisplay;

      console.log("chartScrollIdx: " + chartScrollIdx + ", scrollIdxRef: " + scrollIdxRef.current + ", startIdx: " + startIdx + ", endIdx: " + endIdx);

      const data = {
        labels: chartData.labels.slice(startIdx, endIdx),
        datasets: [
          {
            data: chartData.data.slice(startIdx, endIdx),
            color: (opacity = 1) => `rgba(102, 163, 255, ${opacity})`,
            strokeWidth: 2
          }
        ],
      };

      return (
        <LineChart
          data={data}
          width={screenWidth - 80}
          height={200}
          chartConfig={chartConfig}
          formatYLabel={yValue => {
            if(Math.max(...data.datasets[0].data) >= 5) {
              return Math.round(Number.parseFloat(yValue)).toString();
            } else {
              return yValue;
            }
          }}
        />
      );
    }
  }

  return (
    <View style={styles.chartContainer} onTouchMove={onTouchMove} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {renderChart(props.statistics, DateFilterTypes.YEAR)}
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 10,
    //backgroundColor: "orange",
  }
})
