import {ObjectId} from 'bson';
import ProductGroupDto from "./ProductGroupDto";

export default class ProductCategoryDto {
  _id: ObjectId;
  partitionKey: string;
  name: string;
  isActive: boolean;
  isDefault: boolean;
  order?: number;
  creationDate: Date;

  constructor(name: string, partitionKey?: string) {
    this._id = new ObjectId();
    this.partitionKey = partitionKey || "";
    this.name = name;
    this.isActive = true;
    this.isDefault = false;
    this.order = 0;
    this.creationDate = new Date();
  }
}

export class ProductCategoryGroupDto {
  name: string;
  productGroups: ProductGroupDto[];
}

export const cloneProductCategoryDto = (category: ProductCategoryDto, partitionKey?: string) => {
  return {
    _id: category._id,
    partitionKey: partitionKey || category.partitionKey,
    name: category.name,
    isActive: category.isActive,
    isDefault: category.isDefault,
    order: category.order,
    creationDate: category.creationDate
  }
}
