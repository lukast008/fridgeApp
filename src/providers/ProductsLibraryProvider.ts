import ProductDefDto from "../dto/Product/ProductDefDto";
import ProductDefinitionModel from "../database/ProductDefinitionModel";
import {UpdateMode} from "realm";
import {useEffect, useState} from "react";
import ProductCategoryDto from "../dto/Product/ProductCategoryDto";

export type ProductsLibraryProvider = {
  productDefs: ProductDefDto[];
  saveProductDefinition: (productDefDto: ProductDefDto) => Promise<ProductDefDto>;
  archiveProductDefinition: (productDef: ProductDefDto) => Promise<void>;
}

export default function useProductsLibraryProvider(
  realm: Realm | null,
  user: Realm.User | null,
  fetchNoCategory: () => ProductCategoryDto
): ProductsLibraryProvider {
  const [productDefs, setProductDefs] = useState<ProductDefDto[]>([]);

  useEffect(() => {
    if(realm) fetchProductDefinitions(realm);
    return () => {
      setProductDefs([]);
    }
  }, [realm]);

  function fetchProductDefinitions(realm: Realm) {
    try {
      const productDefs = realm.objects<ProductDefDto>(ProductDefinitionModel.schema.name)
        .filtered("isActive = TRUE")
        .sorted([["name", false], ["unitName", false]]);
      console.log("fetchProductDefinitions: " + productDefs.length);
      productDefs.addListener(items => {
        setProductDefs([...items]);
      });
    } catch (e) {
      console.log("ERROR -> failed to fetchProductDefinitions: ", e);
    }
  }

  async function saveProductDefinition(productDefDto: ProductDefDto) {
    if(realm) {
      const existingProductDef = productDefs.filter(item =>
        item.unitName === productDefDto.unitName &&
        item.name === productDefDto.name &&
        !item._id.equals(productDefDto._id)
      )[0];
      if(existingProductDef) throw Error("Failed to save product definition. Definition with given name and unit already exists");
      const category = !productDefDto.category ? fetchNoCategory() : productDefDto.category;
      realm.write(() => {
        productDefDto.partitionKey = user?.id || "";
        productDefDto.category = category;
        productDefDto.category.partitionKey = user?.id || "";
        realm.create(ProductDefinitionModel.schema.name, productDefDto, UpdateMode.All);
      });
      return productDefDto;
    } else {
      throw Error("Failed to save product definition. Realm is null");
    }
  }

  async function archiveProductDefinition(productDef: ProductDefDto) {
    if(realm) {
      realm.write(() => {
        productDef.isActive = false;
      });
    } else {
      throw Error("Failed to save product definition. Realm is null");
    }
  }

  return { productDefs, saveProductDefinition, archiveProductDefinition };
}
