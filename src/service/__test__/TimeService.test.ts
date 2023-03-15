import TimeService, {mockedDate} from "../TimeService";

describe("Test return current date", () => {
  it("should return given date if specified", () => {
    const timeService = new TimeService(mockedDate);
    expect(timeService.now.getFullYear()).toBe(2021);
    expect(timeService.now.getMonth()).toBe(9);
    expect(timeService.now.getDate()).toBe(12);
    expect(timeService.now.getHours()).toBe(8);
    expect(timeService.now.getMinutes()).toBe(0);
  });

  it("should return current date if not specified", () => {
    const dateNow = new Date();
    const timeService = new TimeService();
    expect(timeService.now.getFullYear()).toBe(dateNow.getFullYear());
    expect(timeService.now.getMonth()).toBe(dateNow.getMonth());
    expect(timeService.now.getDate()).toBe(dateNow.getDate());
    expect(timeService.now.getHours()).toBe(dateNow.getHours());
    expect(timeService.now.getMinutes()).toBe(dateNow.getMinutes());
  });
});
