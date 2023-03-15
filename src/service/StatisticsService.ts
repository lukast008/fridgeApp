import ActivityDto from "../dto/ActivityDto";
import StatisticsDto from "../dto/StatisticsDto";
import StatisticsChartDto from "../dto/StatisticsChartDto";
import DateFilterDto from "../dto/DateFilterDto";
import {DateFilterTypes} from "./DateFilterService";
import {monthNamesShort, weekDayNamesShort} from "../utils/DateUtils";
import ProductDto from "../dto/Product/ProductDto";
import TextNumberUtils from "../utils/TextNumberUtils";
import ProductDefDto from "../dto/Product/ProductDefDto";
import {ProductActions} from "../data/productActionsData";

class StatisticsService {
  groupStatistics(activities: ActivityDto[], products?: ProductDto[] | null): StatisticsDto[] {
    let statisticsMap: Map<string, StatisticsDto> = new Map();
    activities.forEach(activity => {
      const productDef = activity.product.definition;
      let statistics = statisticsMap.get(productDef._id.toString());
      if(statistics) {
        const currentValue = statistics.sumByType.get(activity.actionType) || 0;
        const currentActivities = statistics.activitiesByType.get(activity.actionType) || [];
        statistics.sumByType.set(activity.actionType, TextNumberUtils.roundNumber(currentValue + activity.unitValue));
        statistics.activitiesByType.set(activity.actionType, [...currentActivities, activity]);
      } else {
        const filteredProducts = products?.filter(item => item.definition._id.toString() === productDef._id.toString());
        let accumulatedUnitValue = 0;
        filteredProducts?.forEach(item => accumulatedUnitValue += item.unitValue);
        statistics = {
          _id: productDef._id,
          name: productDef.name,
          unitName: productDef.unitName,
          iconName: productDef.iconName,
          currentUnitValue: accumulatedUnitValue,
          sumByType: new Map([[activity.actionType, TextNumberUtils.roundNumber(activity.unitValue)]]),
          activitiesByType: new Map([[activity.actionType, [activity]]]),
        }
        statisticsMap.set(productDef._id.toString(), statistics);
      }
    });
    return [...statisticsMap.values()];
  }

  getGroupedChartData(activities: ActivityDto[], dateFilter: DateFilterDto) {
    return this.getChartDataByDay(activities);
  }

  getChartDataByDay(activities: ActivityDto[]) {
    console.log("activities: ", activities);
  }


  getChartData(activities: ActivityDto[], dateFilter: DateFilterDto): StatisticsChartDto {
    if(dateFilter.id === DateFilterTypes.WEEK) return this.getChartDataForWeek(activities, dateFilter);
    if(dateFilter.id === DateFilterTypes.YEAR) return this.getChartDataForYear(activities, dateFilter);
    else return this.getChartDataForMonth(activities, dateFilter);
  }

  getChartDataForWeek(activities: ActivityDto[], dateFilter: DateFilterDto): StatisticsChartDto {
    let dataMap: Map<string, number> = new Map();
    for(let i=0; i<7; i++) dataMap.set(weekDayNamesShort[i], 0);

    activities.forEach(activity => {
      const dateIdx = weekDayNamesShort[activity.actionDate.getDay()];
      const currentValue = dataMap.get(dateIdx) || 0;
      dataMap.set(dateIdx, currentValue + activity.unitValue);
    });

    const values = [...dataMap.values()];
    const chartDto: StatisticsChartDto = {
      labels: [...weekDayNamesShort.slice(1), weekDayNamesShort[0]],
      data: [...values.slice(1), values[0]]
    }

    return chartDto;
  }

  getChartDataForMonth(activities: ActivityDto[], dateFilter: DateFilterDto): StatisticsChartDto {
    let dataMap: Map<string, number> = new Map();
    let weekLabels = ['Tydz 1', 'Tydz 2', 'Tydz 3', 'Tydz 4'];
    if(dateFilter.endDate.getDate() > 28) weekLabels.push('Tydz 5');
    for(let i=0; i<weekLabels.length; i++) dataMap.set(weekLabels[i], 0);

    activities.forEach(activity => {
      const dateIdx = weekLabels[Math.floor(activity.actionDate.getDate() / 7)];
      const currentValue = dataMap.get(dateIdx) || 0;
      dataMap.set(dateIdx, currentValue + activity.unitValue);
    });

    const chartDto: StatisticsChartDto = {
      labels: [...dataMap.keys()],
      data: [...dataMap.values()]
    }

    return chartDto;
  }

  getChartDataForYear(activities: ActivityDto[], dateFilter: DateFilterDto): StatisticsChartDto {
    let dataMap: Map<string, number> = new Map();
    for(let i=0; i<monthNamesShort.length; i++) dataMap.set(monthNamesShort[i], 0);

    activities.forEach(activity => {
      const dateIdx = monthNamesShort[activity.actionDate.getMonth()];
      console.log(activity.actionDate + ' ---- ' + dateIdx);
      const currentValue = dataMap.get(dateIdx) || 0;
      dataMap.set(dateIdx, currentValue + activity.unitValue);
    });

    const chartDto: StatisticsChartDto = {
      labels: [...dataMap.keys()],
      data: [...dataMap.values()]
    }

    return chartDto;
  }
}

export const statisticsService = new StatisticsService();
