import ProductDefDto from "./Product/ProductDefDto";
import ProductDto from "./Product/ProductDto";
import ActivityDto from "./ActivityDto";
import ProductCategoryDto from "./Product/ProductCategoryDto";

export default interface ExportImportDto {
  localSchemaVersion: number;
  productDefs: ProductDefDto[],
  products: ProductDto[],
  activities: ActivityDto[],
  productCategories: ProductCategoryDto[],
};
