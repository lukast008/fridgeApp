import DateUtils from './../DateUtils';

jest.mock('react-native-localize', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  findBestAvailableLanguage: jest.fn(),
}));

describe("Test getStartDateOfDay", () => {
  it("should return start date", () => {
    const testDate = new Date();
    const startDate = DateUtils.getStartDateOfDay(testDate);
    expect(startDate.getDay()).toBe(testDate.getDay());
    expect(startDate.getMonth()).toBe(testDate.getMonth());
    expect(startDate.getFullYear()).toBe(testDate.getFullYear());
    expect(startDate.getHours()).toBe(0);
    expect(startDate.getMinutes()).toBe(0);
    expect(startDate.getSeconds()).toBe(0);
    expect(startDate.getMilliseconds()).toBe(0);
  });
});

describe("Test getEndDateOfDay", () => {
  it("should return end date", () => {
    const testDate = new Date();
    const endDate = DateUtils.getEndDateOfDay(testDate);
    expect(endDate.getDay()).toBe(testDate.getDay());
    expect(endDate.getMonth()).toBe(testDate.getMonth());
    expect(endDate.getFullYear()).toBe(testDate.getFullYear());
    expect(endDate.getHours()).toBe(23);
    expect(endDate.getMinutes()).toBe(59);
    expect(endDate.getSeconds()).toBe(59);
    expect(endDate.getMilliseconds()).toBe(999);
  });
});

describe("Test getStartDateOfWeek", () => {
  it("should return Monday if given Friday", () => {
    const testDate = new Date(2020, 9, 2); // 02/10/2020 (Friday) -> week: 28/09/2020 - 04/10/2020
    const startDate = DateUtils.getStartDateOfWeek(testDate);
    expect(startDate.getDay()).toBe(1);
    expect(startDate.getDate()).toBe(28);
    expect(startDate.getMonth()).toBe(8);
    expect(startDate.getFullYear()).toBe(2020);
  });
  it("should return Monday if given Monday", () => {
    const testDate = new Date(2020, 9, 5); // 05/10/2020 (Monday) -> week: 05/10/2020 - 11/10/2020
    const startDate = DateUtils.getStartDateOfWeek(testDate);
    expect(startDate.getDay()).toBe(1);
    expect(startDate.getDate()).toBe(5);
    expect(startDate.getMonth()).toBe(9);
    expect(startDate.getFullYear()).toBe(2020);
  });
  it("should return Monday if given Sunday", () => {
    const testDate = new Date(2020, 9, 11); // 11/10/2020 (Monday) -> week: 05/10/2020 - 11/10/2020
    const startDate = DateUtils.getStartDateOfWeek(testDate);
    expect(startDate.getDay()).toBe(1);
    expect(startDate.getDate()).toBe(5);
    expect(startDate.getMonth()).toBe(9);
    expect(startDate.getFullYear()).toBe(2020);
  });
});

describe("Test getStartDateOfMonth", () => {
  it("should return 1st day of given month if day is last", () => {
    const testDate = new Date(2020, 9, 31); // 31/10/2020
    const startDate = DateUtils.getStartDateOfMonth(testDate);
    expect(startDate.getDate()).toBe(1);
    expect(startDate.getMonth()).toBe(9);
    expect(startDate.getFullYear()).toBe(2020);
  });
  it("should return 1st day of given month if day is first", () => {
    const testDate = new Date(2020, 9, 1); // 01/10/2020
    const startDate = DateUtils.getStartDateOfMonth(testDate);
    expect(startDate.getDate()).toBe(1);
    expect(startDate.getMonth()).toBe(9);
    expect(startDate.getFullYear()).toBe(2020);
  });

});

describe("Test getEndDateOfWeek", () => {
  it("should return Sunday if given Friday", () => {
    const testDate = new Date(2020, 9, 2); // 02/10/2020 (Friday) -> week: 28/09/2020 - 04/10/2020
    const startDate = DateUtils.getLastDateOfWeek(testDate);
    expect(startDate.getDay()).toBe(0);
    expect(startDate.getDate()).toBe(4);
    expect(startDate.getMonth()).toBe(9);
    expect(startDate.getFullYear()).toBe(2020);
  });
  it("should return Sunday if given Sunday", () => {
    const testDate = new Date(2020, 9, 11); // 11/10/2020 (Monday) -> week: 05/10/2020 - 11/10/2020
    const startDate = DateUtils.getLastDateOfWeek(testDate);
    expect(startDate.getDay()).toBe(0);
    expect(startDate.getDate()).toBe(11);
    expect(startDate.getMonth()).toBe(9);
    expect(startDate.getFullYear()).toBe(2020);
  });
  it("should return Sunday if given Monday", () => {
    const testDate = new Date(2020, 9, 5); // 05/10/2020 (Monday) -> week: 05/10/2020 - 11/10/2020
    const startDate = DateUtils.getLastDateOfWeek(testDate);
    expect(startDate.getDay()).toBe(0);
    expect(startDate.getDate()).toBe(11);
    expect(startDate.getMonth()).toBe(9);
    expect(startDate.getFullYear()).toBe(2020);
  });
});

describe("Test areDatesWithinOneDay", () => {
  it("should return true if dates are within one day", () => {
    const date1 = new Date(2020, 9, 2, 13);
    const date2 = new Date(2020, 9, 2, 15);
    expect(DateUtils.areDatesWithinOneDay(date1, date2)).toBe(true);
  });
});
