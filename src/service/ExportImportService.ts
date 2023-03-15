import ProductModel from "../database/ProductModel";
import ActivityModel from "../database/ActivityModel";
import ExportImportDto from "../dto/ExportImportDto";
import ProductDefinitionModel from "../database/ProductDefinitionModel";
import ActivityDto, {cloneActivityDto} from "../dto/ActivityDto";
import {UpdateMode} from "realm";
import ProductDefDto, {cloneProductDefDto} from "../dto/Product/ProductDefDto";
import ProductDto, {cloneProductDto} from "../dto/Product/ProductDto";
import ProductCategoryDto, {cloneProductCategoryDto} from "../dto/Product/ProductCategoryDto";
import ProductCategoryModel from "../database/ProductCategoryModel";

class ExportImportService {

  prepareDataFromDb = async(realm: Realm): Promise<ExportImportDto> => {
    const schemaVersion = realm.schemaVersion;
    const productDefs = [...realm.objects<ProductDefDto>(ProductDefinitionModel.schema.name)];
    const productCategories = [...realm.objects<ProductCategoryDto>(ProductCategoryModel.schema.name)];
    const products = [...realm.objects<ProductDto>(ProductModel.schema.name)];
    const activities = [...realm.objects<ActivityDto>(ActivityModel.schema.name)];

    return {
      localSchemaVersion: schemaVersion,
      productDefs: productDefs,
      products: products,
      activities: activities,
      productCategories: productCategories
    }
  }

  copyRealmData = async(source: Realm, target: Realm, user: Realm.User | null) => {
    const partitionKey = user ? user.id : "";
    target.write(() => {
      target.deleteAll();
      source.objects<ProductCategoryDto>(ProductCategoryModel.schema.name).forEach(category => {
        let copyCategory = cloneProductCategoryDto(category, partitionKey);
        target.create(ProductCategoryModel.schema.name, copyCategory, UpdateMode.All);
      });

      source.objects<ProductDefDto>(ProductDefinitionModel.schema.name).forEach(productDef => {
        let copyProductDef = cloneProductDefDto(productDef, partitionKey);
        target.create(ProductDefinitionModel.schema.name, copyProductDef, UpdateMode.All);
      });

      source.objects<ProductDto>(ProductModel.schema.name).forEach(product => {
        let copyProduct = cloneProductDto(product, partitionKey)
        target.create(ProductModel.schema.name, copyProduct, UpdateMode.All);
      });

      source.objects<ActivityDto>(ActivityModel.schema.name).forEach(activity => {
        let copyActivity = cloneActivityDto(activity, partitionKey);
        target.create(ActivityModel.schema.name, copyActivity, UpdateMode.All);
      });
    });
  }
}

export const exportImportService = new ExportImportService();
