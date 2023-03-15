import UuidUtils from '../../utils/UuidUtils';
import ProductDefDto, {cloneProductDefDto} from "./ProductDefDto";

export default class ProductDto {
  _id: string;
  partitionKey: string;
  description: string;
  unitValue: number;
  initialUnitValue: number;
  massValuePerUnit?: number;
  expirationDate: Date;
  isActive: boolean;
  creationDate: Date;
  openingDate?: Date;
  definition: ProductDefDto;

  constructor(description: string, unitValue: number, expirationDate: Date, creationDate: Date, productDef?: ProductDefDto) {
    this._id = UuidUtils.generateId();
    if(productDef) this.definition = productDef;
    this.description = description;
    this.unitValue = unitValue;
    this.initialUnitValue = unitValue;
    this.expirationDate = expirationDate;
    this.isActive = true;
    this.creationDate = creationDate;
  }
}

export const cloneProductDto = (p: ProductDto, partitionKey?: string): ProductDto => {
  const copyProductDef = cloneProductDefDto(p.definition, partitionKey);
  return {
    _id: p._id,
    partitionKey: partitionKey || p.partitionKey,
    description: p.description,
    unitValue: p.unitValue,
    initialUnitValue: p.initialUnitValue,
    massValuePerUnit: p.massValuePerUnit,
    expirationDate: p.expirationDate,
    isActive: p.isActive,
    creationDate: p.creationDate,
    openingDate: p.openingDate,
    definition: copyProductDef
  }
}
