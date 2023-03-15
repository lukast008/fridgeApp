import UuidUtils from "../utils/UuidUtils";
import ProductDto, {cloneProductDto} from "./Product/ProductDto";

export default class ActivityDto {
  _id: string;
  partitionKey: string;
  actionDate: Date;
  actionType: string;
  unitValue: number;
  product: ProductDto;
  isActive: boolean;
  creationDate: Date;

  constructor(actionType: string, unitValue: number, product: ProductDto, actionDate: Date) {
    this._id = UuidUtils.generateId();
    this.actionType = actionType;
    this.unitValue = unitValue;
    this.actionDate = actionDate;
    this.product = product;
    this.isActive = true;
    this.creationDate = new Date();
  }
}

export const cloneActivityDto = (activity: ActivityDto, partitionKey?: string): ActivityDto => {
  const copyProductDto = cloneProductDto(activity.product, partitionKey);
  return {
    _id: activity._id,
    partitionKey: partitionKey || activity.partitionKey,
    actionDate: activity.actionDate,
    actionType: activity.actionType,
    unitValue: activity.unitValue,
    product: copyProductDto,
    isActive: activity.isActive,
    creationDate: activity.creationDate
  }
}
