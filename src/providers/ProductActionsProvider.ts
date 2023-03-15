import {useAuth} from "./AuthProvider";
import {useData} from "./DataProvider";
import ProductDto from "../dto/Product/ProductDto";
import ActivityDto from "../dto/ActivityDto";
import {ProductActions} from "../data/productActionsData";
import TextNumberUtils from "../utils/TextNumberUtils";
import ActivityModel from "../database/ActivityModel";
import {UpdateMode} from "realm";

type ConsumeProductProviderType = {
  consumeProduct: (product: ProductDto, unitValue: number, actionDate: Date) => ActivityDto;
  throwAwayProduct: (product: ProductDto, unitValue: number, actionDate: Date) => ActivityDto;
  deleteProduct: (product: ProductDto, actionDate: Date) => void;
  undoActivity: (activity: ActivityDto) => void;
}

export default function useProductActionsProvider(): ConsumeProductProviderType {
  const { user } = useAuth()
  const { realm, getActivitiesForProduct } = useData();

  function consumeProduct(product: ProductDto, unitValue: number, actionDate: Date) {
    const activity = new ActivityDto(ProductActions.CONSUME, unitValue, product, actionDate);
    activity.partitionKey = user?.id || "";
    if(realm) {
      realm.write(() => {
        product.unitValue = TextNumberUtils.roundNumber(product.unitValue - unitValue);
        realm.create(ActivityModel.schema.name, activity, UpdateMode.All);
      });
    }
    return activity;
  }

  function throwAwayProduct(product: ProductDto, unitValue: number, actionDate: Date) {
    const activity = new ActivityDto(ProductActions.THROW_AWAY, unitValue, product, actionDate);
    activity.partitionKey = user?.id || "";
    if(realm) {
      realm.write(() => {
        product.unitValue = TextNumberUtils.roundNumber(product.unitValue - unitValue);
        realm.create(ActivityModel.schema.name, activity, UpdateMode.All);
      });
    }
    return activity;
  }

  function deleteProduct(product: ProductDto, actionDate: Date) {
    const activity = new ActivityDto(ProductActions.DELETE, product.unitValue, product, actionDate);
    activity.partitionKey = user?.id || "";
    if(realm) {
      realm.write(() => {
        product.isActive = false;
        realm.create(ActivityModel.schema.name, activity, UpdateMode.All);
      });
    }
  }

  function undoActivity(activity: ActivityDto) {
    if(realm) {
      realm.write(() => {
        const activityFromDb = realm.objectForPrimaryKey<ActivityDto>(ActivityModel.schema.name, activity._id);
        if(activityFromDb) {
          const product = activityFromDb.product;
          if(activity.actionType === ProductActions.CONSUME || activity.actionType === ProductActions.THROW_AWAY) {
            product.unitValue = TextNumberUtils.roundNumber(product.unitValue + activity.unitValue);
          } else if(activity.actionType === ProductActions.DELETE) {
            product.isActive = true;
          } else if(activity.actionType === ProductActions.ADD) {
            const activities = getActivitiesForProduct(product._id);
            if(activities.length === 1) {
              product.unitValue = 0;
            } else {
              console.warn("Woooops we cannot remove such product, there are " + activities.length + " activities");
              return;
            }
          } else {
            console.warn("Action not supported");
            return;
          }
          activityFromDb.isActive = false;
        }
      });
    }
  }

  return {
    consumeProduct,
    throwAwayProduct,
    deleteProduct,
    undoActivity
  }
}
