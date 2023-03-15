import ActivityDto from "./ActivityDto";

export default interface StatisticsDto {
  _id: ObjectId,
  name: string,
  unitName: string,
  iconName: string,
  isOnShoppingList?: boolean;
  currentUnitValue: number,
  sumByType: Map<string, number>
  activitiesByType: Map<string, ActivityDto[]>,
};
