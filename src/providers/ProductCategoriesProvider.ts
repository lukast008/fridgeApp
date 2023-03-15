import ProductCategoryDto from "../dto/Product/ProductCategoryDto";
import ProductCategoryModel from "../database/ProductCategoryModel";
import {UpdateMode} from "realm";
import {useEffect, useState} from "react";
import ProductDefDto from "../dto/Product/ProductDefDto";
import ProductDefinitionModel from "../database/ProductDefinitionModel";
import {useDefaultTranslation} from "../utils/TranslationsUtils";

export type ProductsCategoriesProvider = {
  productCategories: ProductCategoryDto[];
  saveProductCategory: (current: ProductCategoryDto | null, name: string) => Promise<ProductCategoryDto>;
  deleteProductCategory: (productCategory: ProductCategoryDto) => Promise<void>;
  updateCategoriesOrder: (categories: ProductCategoryDto[]) => Promise<ProductCategoryDto[]>;
  fetchNoCategory: () => ProductCategoryDto;
}

export default function useProductCategoriesProvider(realm: Realm | null, user: Realm.User | null): ProductsCategoriesProvider {
  const { t } = useDefaultTranslation('productCategories');
  const [productCategories, setProductCategories] = useState<ProductCategoryDto[]>([]);

  useEffect(() => {
    if(realm) {
      fetchProductCategories(realm);
    }
    return () => {
      setProductCategories([]);
    }
  }, [realm]);

  function fetchProductCategories(realm: Realm) {
    try {
      const productCategories = realm.objects<ProductCategoryDto>(ProductCategoryModel.schema.name)
        .filtered("isActive = TRUE")
        .sorted([["isDefault", false], ["order", false]]);
      console.log("fetchProductCategories: " + productCategories.length);
      productCategories.addListener(result => setProductCategories([...result]));
    } catch (e) {
      console.log("ERROR -> failed to fetchProductCategories: ", e);
    }
  }

  function fetchNoCategory(): ProductCategoryDto {
    if(!realm) throw new Error("ERROR in fetchNoCategory -> realm cannot be null");
    try {
      const noCategoryName = t("no-category-default");
      let noCategoryDto: ProductCategoryDto = realm.objects<ProductCategoryDto>(ProductCategoryModel.schema.name).filtered("isDefault = TRUE")[0];
      if(!noCategoryDto) {
        realm.write(() => {
          noCategoryDto = new ProductCategoryDto(noCategoryName);
          noCategoryDto.isDefault = true;
          noCategoryDto.partitionKey = user?.id || "";
          realm.create(ProductCategoryModel.schema.name, noCategoryDto, UpdateMode.All)
        })
      }
      return noCategoryDto;
    } catch (e) {
      console.log("ERROR -> failed to fetchNoCategory: ", e);
      throw e;
    }
  }

  async function saveProductCategory(current: ProductCategoryDto | null, name: string) {
    if(realm) {
      const productCategoryDto = current || new ProductCategoryDto(name);
      realm.write(() => {
        productCategoryDto.partitionKey = user?.id || "";
        productCategoryDto.name = name;
        realm.create(ProductCategoryModel.schema.name, productCategoryDto, UpdateMode.All);
      });
      return productCategoryDto;
    } else {
      throw Error("Failed to save product category. Realm is null");
    }
  }

  async function deleteProductCategory(productCategory: ProductCategoryDto) {
    if(realm) {
      if(productCategory.isDefault) throw Error("Cannot delete default category!");
      const noCategoryDto = fetchNoCategory();
      realm.write(() => {
        const productsWithCategory = realm
          .objects<ProductDefDto>(ProductDefinitionModel.schema.name)
          .filtered("category._id == $0", productCategory._id);
        productsWithCategory.forEach(productDef => productDef.category = noCategoryDto);
        productCategory.isActive = false;
      });
    } else {
      throw Error("Failed to delete product category. Realm is null");
    }
  }

  async function updateCategoriesOrder(categories: ProductCategoryDto[]) {
    if(realm) {
      realm.write(() => {
        categories.forEach((category, index) => category.order = index+1);
      });
      return categories;
    } else {
      throw Error("Failed to save product category. Realm is null");
    }
  }

  return { productCategories, saveProductCategory, deleteProductCategory, updateCategoriesOrder, fetchNoCategory }
}
