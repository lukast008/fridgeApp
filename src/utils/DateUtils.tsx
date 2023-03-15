import COLORS from "../../assets/colors";
import moment from 'moment';
import i18n from "./TranslationsUtils";
import { format } from "date-fns";

moment.locale(i18n.language);

const monthNames = moment.localeData().months();
export const monthNamesShort = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const weekDayNames = moment.localeData().weekdays();
export const weekDayNamesShort = moment.localeData().weekdaysShort();

export default class DateUtils {

  static convertDateToString = (date: Date) => {
    if(DateUtils.isInfinityDate(date)) return "-";
    else return moment(date).format("ll");
  }

  static convertDateToTimeString = (date: Date) => {
    if(DateUtils.isInfinityDate(date)) return "";
    else return moment(date).format("lll");
  }

  static convertDateToRelativeTime(date: Date) {
    const isToday = moment(date).isSame(new Date(), "day");
    if(DateUtils.isInfinityDate(date)) return "";
    else if(isToday) return i18n.t("dates:today");
    else return moment(this.getStartDateOfDay(date)).from(this.getStartDateOfDay(new Date()));
  }

  static convertDateToDayString(date: Date) {
    if(DateUtils.isInfinityDate(date)) return "";
    else return DateUtils.getDayWeekName(date) + ", " + date.getDate() + " " + DateUtils.getMonthName(date).slice(0,3) + " " + date.getFullYear();
  }

  static convertDateToShortDayString(date: Date) {
    if(DateUtils.isInfinityDate(date)) return "";
    else return DateUtils.getShortDayWeekName(date) + ", " + date.getDate() + " " + DateUtils.getMonthName(date).slice(0,3) + " " + date.getFullYear();
  }

  static convertDateToValueAndRelative(date?: Date, labeIfNoDate?: string) {
    if(!date || DateUtils.isInfinityDate(date)) return labeIfNoDate || "-";
    else return this.convertDateToString(date) + " (" + this.convertDateToRelativeTime(date) + ")";
  }

  static convertDateToDateTimeString = (date: Date) => {
    return format(date, "yyyy-MM-dd HH:mm:ss.SSS");
  }

  static convertDateToDateTimeInputString = (date: Date) => {
    return format(date, "yyyy-MM-dd HH:mm");
  }

  static convertStringToDate = (date: string) => {
    return new Date(Date.parse(date));
  }

  static addDaysToDate = (date: Date, days: number) => {
    date.setDate(date.getDate() + days);
    return date;
  }

  static getDaysToExpiration = (date: Date) => {
    const dt1 = new Date(date);
    const dt2 = new Date();
    return Math.floor((Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) - Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  static getExpirationDateColor = (date: Date) => {
    const daysToExpiration = DateUtils.getDaysToExpiration(date);
    if(daysToExpiration < 0) return COLORS.invalid;
    else if(daysToExpiration < 3) return COLORS.yellow;
    else return COLORS.textDark;
  }

  static getStartDateOfDay = (date: Date) => {
    let startDate = new Date(date);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    return startDate;
  }

  static getEndDateOfDay = (date: Date) => {
    let endDate = new Date(date);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(999);
    return endDate;
  }

  static getInfinitDate = () => {
    return DateUtils.convertStringToDate("2199-01-01");
  }

  static isInfinityDate = (date: Date) => {
    return date.getFullYear() === 2199;
  }

  static getStartDateOfMonth = (date: Date) => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
  }

  static getLastDateOfMonth = (date: Date) => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth()+1, 0));
  }

  static getMonthName = (date: Date) => {
    return monthNames[date.getMonth()];
  }

  static getDayWeekName = (date: Date) => {
    return weekDayNames[date.getDay()];
  }

  static getShortDayWeekName = (date: Date) => {
    return weekDayNamesShort[date.getDay()];
  }

  static getStartDateOfWeek = (date: Date) => {
    let startDate: Date = DateUtils.getStartDateOfDay(date);
    if(startDate.getDay() === 0) startDate.setDate(startDate.getDate() - 6);
    else startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
    return startDate;
  }

  static getLastDateOfWeek = (date: Date) => {
    let endDate = DateUtils.getEndDateOfDay(date);
    if(endDate.getDay() === 0) return endDate;
    endDate.setDate(endDate.getDate() - endDate.getDay() + 7);
    return endDate;
  }

  static getStartDateOfYear = (date: Date) => {
    let startDate = DateUtils.getStartDateOfDay(date);
    return new Date(Date.UTC(startDate.getFullYear(), 0, 1));
  }

  static getLastDateOfYear = (date: Date) => {
    let endDate = DateUtils.getEndDateOfDay(date);
    return new Date(Date.UTC(endDate.getFullYear(), 11, 31));
  }

  static areDatesWithinOneDay(date1: Date, date2: Date) {
    const start = this.getStartDateOfDay(date1);
    const end = this.getEndDateOfDay(date1);
    return date2.getTime() >= start.getTime() && date2.getTime() <= end.getTime();
  }

  static getDiffDays(date1: Date, date2: Date) {
    const d1 = moment(this.getStartDateOfDay(date1));
    const d2 = moment(this.getStartDateOfDay(date2));
    return d1.diff(d2, "days");
  }

  static getDiffInMs(start: Date, end: Date) {
    return end.getMilliseconds() - start.getMilliseconds();
  }
}
