import {ObjectId} from 'bson';
import ProductCategoryDto, {cloneProductCategoryDto} from "./ProductCategoryDto";

export default class ProductDefDto {
  _id: ObjectId;
  partitionKey: string;
  name: string;
  iconName: string;
  unitName: string;
  category?: ProductCategoryDto;
  isActive: boolean;
  creationDate: Date;
  isSaving?: boolean;

  constructor(name: string, uniName: string, iconName: string, category?: ProductCategoryDto) {
    this._id = new ObjectId();
    this.partitionKey = "";
    this.name = name;
    this.unitName = uniName;
    this.category = category;
    this.iconName = iconName;
    this.isActive = true;
    this.creationDate = new Date();
    this.isSaving = false;
  }
}

export const cloneProductDefDto = (productDefDto: ProductDefDto, partitionKey?: string): ProductDefDto => {
  const copyCategoryDto = productDefDto.category ? cloneProductCategoryDto(productDefDto.category, partitionKey) : undefined;
  return {
    _id: productDefDto._id,
    partitionKey: partitionKey || productDefDto.partitionKey,
    name: productDefDto.name,
    iconName: productDefDto.iconName,
    unitName: productDefDto.unitName,
    category: copyCategoryDto,
    isActive: productDefDto.isActive,
    creationDate: productDefDto.creationDate,
    isSaving: productDefDto.isSaving
  }
}
