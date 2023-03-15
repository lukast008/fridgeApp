import ProductDto from "../../dto/Product/ProductDto";
import ProductModel from "../ProductModel";
import ActivityModel from "../ActivityModel";
import ActivityDto from "../../dto/ActivityDto";
import {UpdateMode} from "realm";
import ProductDefDto from "../../dto/Product/ProductDefDto";
import ProductDefinitionModel from "../ProductDefinitionModel";

export default function migrateLocalDB(oldRealm: Realm, newRealm: Realm) {
  console.log("migrateLocalDB: " + oldRealm.schemaVersion);
  if(oldRealm.schemaVersion < 7) {
    const oldProducts = oldRealm.objects<any>(ProductModel.schema.name);
    const products = newRealm.objects<ProductDto>(ProductModel.schema.name);
    for (let i = 0; i < products.length; i++) {
      products[i]._id = oldProducts[i].id;
    }
    const oldActivities = oldRealm.objects<any>("ProductHistory");
    const activities = newRealm.objects<ActivityDto>("ProductHistory");
    for (let i = 0; i < activities.length; i++) {
      activities[i]._id = oldActivities[i].id;
    }
  }
  if(oldRealm.schemaVersion < 8) {
    const oldObjects = oldRealm.objects<ActivityDto>("ProductHistory");
    oldObjects.forEach(activity => {
      newRealm.create(ActivityModel.schema.name, activity, UpdateMode.All);
    });
    //newRealm.deleteModel("ProductHistory");
  }
  if(oldRealm.schemaVersion < 15) {
    const productDefs = newRealm.objects<ProductDefDto>(ProductDefinitionModel.schema.name);
    productDefs.forEach(productDef => {
      const oldProductDef = oldRealm.objectForPrimaryKey<ProductDefDto>(ProductDefinitionModel.schema.name, productDef._id);
      console.log(productDef.name + " -- " + productDef.unitName);
      const products = newRealm.objects<ProductDto>(ProductModel.schema.name).filtered("definition._id = $0", productDef._id);
      products.forEach(product => {
        const activities = newRealm.objects<ActivityDto>(ActivityModel.schema.name).filtered("product._id = $0", product._id);
        let initialValue = activities.filtered("actionType = 'add' OR actionType = 'open'")[0].unitValue;
        if(oldProductDef && (oldProductDef.unitName === "kilogram" || oldProductDef.unitName === "liter")) {
          product.initialUnitValue = 1;
          product.massValuePerUnit = product.unitValue;
          product.unitValue = product.unitValue === 0 ? 0 : product.unitValue/initialValue;
          if(productDef.unitName === 'kilogram') productDef.unitName = 'package';
          if(productDef.unitName === 'liter') productDef.unitName = 'bottle';
          activities.forEach(activity => {
            activity.unitValue = activity.unitValue/initialValue;
          });
        } else {
          product.initialUnitValue = initialValue;
        }
      });
    });
  }
  if(oldRealm.schemaVersion < 16) {
    console.log(" *** realm migration to version 16 - update open products")
    const products = newRealm.objects<any>(ProductModel.schema.name);
    products.forEach(product => {
      if(product.openingDate) {
        if(product.parent) {
          const activities = newRealm.objects<ActivityDto>(ActivityModel.schema.name).filtered("product._id = $0", product._id);
          activities.forEach(activity => {
            if(activity.actionType === "delete" || activity.actionType === "open") {
              newRealm.delete(activity);
            } else {
              if(product.parent) {
                activity.product = product.parent;
              }
            }
          });
          product.parent.unitValue = product.parent.unitValue + product.unitValue;
        }
        newRealm.delete(product);
      }
    });
  }
}
