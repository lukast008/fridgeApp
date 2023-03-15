class TimeService {
  currentDate: Date;

  constructor(currentDate?: Date) {
    this.currentDate = currentDate || new Date();
  }

  get now() {
    return this.currentDate;
  }
}

export const timeService = new TimeService();
export default TimeService;
export const mockedDate = new Date(2021, 9, 12, 8); // 12/10/2021 08:00 (Tue)
