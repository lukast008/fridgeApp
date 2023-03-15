import DateUtils from "../../utils/DateUtils";

export default class LogFilterDto {
  onlyCurrentSession: boolean;
  startDate: Date;
  endDate: Date;
  sortingOrder: 'DESC' | 'ASC';

  constructor(
    onlyCurrentSession = true,
    startDate = DateUtils.getStartDateOfDay(new Date()),
    endDate = DateUtils.getEndDateOfDay(new Date()),
    sortingOrder: 'DESC' | 'ASC' = 'DESC') {
    this.onlyCurrentSession = onlyCurrentSession;
    this.startDate = startDate;
    this.endDate = endDate;
    this.sortingOrder = sortingOrder;
  }
}
