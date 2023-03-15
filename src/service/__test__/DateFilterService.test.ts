import {dateFilterService} from "../DateFilterService";
import DateFilterDto from "../../dto/DateFilterDto";

jest.mock('react-native-localize', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  findBestAvailableLanguage: jest.fn(),
}));

describe("Test prepareMonthFilterData", () => {
  it("should return correct FilterData", () => {
    const dateFilterDto:DateFilterDto = dateFilterService.prepareMonthFilterData(new Date(2020, 9, 2));
    expect(dateFilterDto.name).toBe("Month");
    expect(dateFilterDto.value).toBe("October 2020");
    expect(dateFilterDto.startDate.getDate()).toBe(1);
    expect(dateFilterDto.startDate.getMonth()).toBe(9);
    expect(dateFilterDto.endDate.getDate()).toBe(31);
    expect(dateFilterDto.endDate.getMonth()).toBe(9);
  });
});

describe("Test prepareWeekFilterData", () => {
  it("should return correct FilterData", () => {
    const dateFilterDto:DateFilterDto = dateFilterService.prepareWeekFilterData(new Date(2020, 9, 2));
    expect(dateFilterDto.name).toBe("Week");
    expect(dateFilterDto.value).toBe("28 Sep - 4 Oct 2020");
    expect(dateFilterDto.startDate.getDate()).toBe(28);
    expect(dateFilterDto.startDate.getMonth()).toBe(8);
    expect(dateFilterDto.endDate.getDate()).toBe(4);
    expect(dateFilterDto.endDate.getMonth()).toBe(9);
  });
});

describe("Test prepareDayFilterData", () => {
  it("should return correct FilterData", () => {
    const dateFilterDto:DateFilterDto = dateFilterService.prepareDayFilterData(new Date(2020, 9, 2, 7));
    expect(dateFilterDto.name).toBe("Day");
    expect(dateFilterDto.value).toBe("Friday, 2 Oct 2020");
    expect(dateFilterDto.startDate.getDate()).toBe(2);
    expect(dateFilterDto.startDate.getMonth()).toBe(9);
    expect(dateFilterDto.endDate.getDate()).toBe(2);
    expect(dateFilterDto.endDate.getMonth()).toBe(9);
  });
});

describe("Test prepareYearFilterData", () => {
  it("should return correct FilterData", () => {
    const dateFilterDto:DateFilterDto = dateFilterService.prepareYearFilterData(new Date(2020, 9, 2));
    expect(dateFilterDto.name).toBe("Year");
    expect(dateFilterDto.value).toBe("Year 2020");
    expect(dateFilterDto.startDate.getDate()).toBe(1);
    expect(dateFilterDto.startDate.getMonth()).toBe(0);
    expect(dateFilterDto.endDate.getDate()).toBe(31);
    expect(dateFilterDto.endDate.getMonth()).toBe(11);
  });
});
