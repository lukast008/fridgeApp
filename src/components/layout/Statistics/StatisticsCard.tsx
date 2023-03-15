import React, {useEffect, useState} from 'react'
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import StatisticsDto from "../../../dto/StatisticsDto";
import {T1, T2, T3, T4} from "../Text/Text";
import {Card} from "react-native-elements";
import IconService from "../../../service/IconService";
import {unitService} from "../../../service/UnitService";
import TextNumberUtils from "../../../utils/TextNumberUtils";
import { Dimensions } from "react-native";
import {ProductActions} from "../../../data/productActionsData";
import COLORS from "../../../../assets/colors";
import {LineChart} from "react-native-chart-kit";
import {statisticsService} from "../../../service/StatisticsService";
import ActivityDto from "../../../dto/ActivityDto";
import DateFilterDto from "../../../dto/DateFilterDto";
import {DateFilterTypes} from "../../../service/DateFilterService";
import ShoppingListIndicator from "../ShoppingList/ShoppingListIndicator";

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

type Props = {
  statistics: StatisticsDto;
  dateFilter: DateFilterDto;
  onProductSelected: (productDefId: ObjectId) => void;
}

export default function StatisticsCard(props: Props) {

  const [chartActionType, setChartActionType] = useState('');
  const [isChartVisible, setIsChartVisible] = useState(false);

  useEffect(() => {
    setIsChartVisible(false);
    setChartActionType('');
  }, [props.dateFilter.id]);

  function toggleChart (actionType: string) {
    if(!actionType) return;
    if(chartActionType === actionType) {
      setIsChartVisible(false);
      setChartActionType('');
    } else {
      setIsChartVisible(true);
      setChartActionType(actionType);
    }
  }

  function renderChart (statistics: StatisticsDto) {
    if(isChartVisible && chartActionType && props.dateFilter.id !== DateFilterTypes.DAY) {
      console.log("\n\n ************** RENDER CHART ***************");
      const activities: ActivityDto[] = statistics.activitiesByType.get(chartActionType) || [];
      const chartDto = statisticsService.getChartData(activities, props.dateFilter);
      const data = {
        labels: chartDto.labels,
        datasets: [
          {
            data: chartDto.data,
            color: (opacity = 1) => `rgba(102, 163, 255, ${opacity})`,
            strokeWidth: 2
          }
        ],
      };

      return (
        <View style={styles.chartContainer}>
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
        </View>
      );
    }
  }

  function renderSum(statistics: StatisticsDto, type: string, borderRight: boolean) {
    const sum = statistics.sumByType.get(type);
    const borderRightWidth = borderRight ? 2 : 0;
    const backgroundColor = chartActionType === type ? COLORS.primary : COLORS.background;
    const fontColor = chartActionType === type ? COLORS.textLight : COLORS.textDark;
    return (
      <TouchableOpacity
        style={[styles.column, {borderRightWidth: borderRightWidth, backgroundColor: backgroundColor}]}
        //onPress={() => sum && props.dateFilter.id !== DateFilterTypes.DAY && toggleChart(type)}
      >
        {sum &&
        <>
            <T2 style={{color: fontColor}}>{TextNumberUtils.convertNumberToString(sum)}</T2>
            <T4 style={{color: fontColor}}>{unitService.getUnitNameForNumber(statistics.unitName, sum)}</T4>
        </>
        }
        {!sum && <T2>-</T2>}
      </TouchableOpacity>
    );
  }

  function renderCurrentUnitValue() {
    if(props.statistics.currentUnitValue) {
      const unitName = unitService.getUnitNameForNumber(props.statistics.unitName, props.statistics.currentUnitValue);
      return (
        <T3 numberOfLines={1}> ({props.statistics.currentUnitValue} {unitName})</T3>
      );
    }
  }

  function render() {

    const iconPath = IconService.getIconByName(props.statistics.iconName)?.iconPath;

    return (
      <TouchableOpacity onPress={() => props.onProductSelected(props.statistics._id)}>
        <Card containerStyle={styles.card}>
          <View style={styles.row}>
            <Image source={iconPath} style={{width: 30, height: 30}} />
            <View style={styles.rowHeader}>
              <T1 numberOfLines={1} style={styles.title}>{props.statistics.name}</T1>
              {renderCurrentUnitValue()}
            </View>
          </View>
          <View style={styles.row}>
            {renderSum(props.statistics, ProductActions.ADD, true)}
            {renderSum(props.statistics, ProductActions.CONSUME, true)}
            {renderSum(props.statistics, ProductActions.THROW_AWAY, false)}
          </View>
          {renderChart(props.statistics)}
          <ShoppingListIndicator title={props.statistics.name} isOnList={!!props.statistics.isOnShoppingList} />
        </Card>
      </TouchableOpacity>
    );
  }

  return render();
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 60,
    flex: 1,
  },
  title: {
    marginLeft: 10,
  },
  column: {
    flex: 1,
    borderColor: COLORS.primary,
    marginTop: 5,
    padding: 2,
    alignItems: "center",
    height: "100%",
  },
  chartContainer: {
    marginTop: 10,
  }
})
