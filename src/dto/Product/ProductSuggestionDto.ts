import ProductDefDto from "./ProductDefDto";

export default class ProductSuggestionDto {
  productDef: ProductDefDto;
  currentUnitValue?: number;
  unitValue: number;
  massValue: number;
  daysToExpire: number;
}
