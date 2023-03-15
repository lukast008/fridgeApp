import {statisticsService} from "../StatisticsService";
import {ProductActions} from "../../data/productActionsData";
import {getActivitySet, getProductDefinitionSet} from "./mockData";

jest.mock('react-native-get-random-values', () => '');
jest.mock('react-native-localize', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  findBestAvailableLanguage: jest.fn(),
}));

describe("Test groupStatistics", () => {
  it("should return grouped list of statistics", () => {
    const result = statisticsService.groupStatistics(getActivitySet());
    expect(result.length).toBe(2);
    expect(result[0].name).toBe("Apple");
    expect(result[0].unitName).toBe("item");
    expect(result[0].sumByType.get(ProductActions.ADD)).toBe(5);
    expect(result[0].sumByType.get(ProductActions.CONSUME)).toBe(8);
  });
});
