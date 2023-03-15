export default interface ActivityTypeDto {
  name: string,
  iconName: string,
  listIconName?: string,
  iconColor: string,
  buttonColor: string,
  isExpirationDateRequired: boolean,
  label: string,
  actionDateLabel: string,
  descriptionDone: string;
  hasDescriptionDoneUnits: boolean;
};
