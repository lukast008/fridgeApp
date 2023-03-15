import ProductDto from "./ProductDto";
import ProductCategoryDto from "./ProductCategoryDto";

export default class ProductGroupDto {
  _id: ObjectId;
  name: string;
  unitName: string;
  iconName: string;
  category?: ProductCategoryDto;
  isActive: boolean;
  isOnShoppingList?: boolean;
  items: ProductDto[];
}
