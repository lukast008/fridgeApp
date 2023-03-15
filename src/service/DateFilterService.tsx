import DateFilterDto from "../dto/DateFilterDto";
import DateUtils from "../utils/DateUtils";
import i18n from "../utils/TranslationsUtils";

export const DateFilterTypes = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
  ALL: "all"
}

class DateFilterService {

  getFilterData(type: string, index: number): DateFilterDto {
    let date = new Date();

    if(type === DateFilterTypes.DAY) {
      date.setDate(date.getDate() - index);
      return this.prepareDayFilterData(date);
    } else if(type === DateFilterTypes.WEEK) {
      date.setDate(date.getDate() - index * 7);
      return this.prepareWeekFilterData(date);
    } else if(type === DateFilterTypes.YEAR) {
      date.setFullYear(date.getFullYear() - index);
      return this.prepareYearFilterData(date);
    } else if(type === DateFilterTypes.ALL) {
      date.setFullYear(2000);
      return this.prepareAllFilterData(date);
    } else { // MONTH
      const newDate = new Date(Date.UTC(date.getFullYear(), date.getMonth()-index));
      return this.prepareMonthFilterData(newDate);
    }
  }

  prepareMonthFilterData(date: Date): DateFilterDto {
    return {
      id: DateFilterTypes.MONTH,
      name: i18n.t("dates:month"),
      value: DateUtils.getMonthName(date) + " " + date.getFullYear(),
      startDate: DateUtils.getStartDateOfMonth(date),
      endDate: DateUtils.getLastDateOfMonth(date)
    };
  }

  prepareWeekFilterData(date: Date): DateFilterDto {
    const startDate = DateUtils.getStartDateOfWeek(date);
    const endDate = DateUtils.getLastDateOfWeek(date);
    const startDateVal = startDate.getDate() + " " + DateUtils.getMonthName(startDate).slice(0, 3);
    const endDateVal = endDate.getDate() + " " + DateUtils.getMonthName(endDate).slice(0, 3);
    return {
      id: DateFilterTypes.WEEK,
      name: i18n.t("dates:week"),
      value: startDateVal + " - " + endDateVal + " " + startDate.getFullYear(),
      startDate: DateUtils.getStartDateOfWeek(date),
      endDate: DateUtils.getLastDateOfWeek(date)
    };
  }

  prepareDayFilterData(date: Date): DateFilterDto {
    date.setHours(7);
    return {
      id: DateFilterTypes.DAY,
      name: i18n.t("dates:day"),
      value: DateUtils.getDayWeekName(date) + ", " + date.getDate() + " " + DateUtils.getMonthName(date).slice(0, 3) + " " + date.getFullYear(),
      startDate: DateUtils.getStartDateOfDay(date),
      endDate: DateUtils.getEndDateOfDay(date)
    };
  }

  prepareYearFilterData(date: Date) {
    return {
      id: DateFilterTypes.YEAR,
      name: i18n.t("dates:year"),
      value: i18n.t("dates:year") + " " + date.getFullYear(),
      startDate: DateUtils.getStartDateOfYear(date),
      endDate: DateUtils.getLastDateOfYear(date)
    };
  }

  prepareAllFilterData(date: Date) {
    return {
      id: DateFilterTypes.ALL,
      name: i18n.t("dates:all"),
      value: i18n.t("dates:all"),
      startDate: DateUtils.getStartDateOfYear(date),
      endDate: DateUtils.getLastDateOfYear(new Date())
    };
  }

  getDefaultFilterType() {
    return DateFilterTypes.DAY;
  }

  getShouldRenderSectionHeader(filterData: DateFilterDto) {
    return filterData.id !== DateFilterTypes.DAY;
  }
}

export const dateFilterService = new DateFilterService();
