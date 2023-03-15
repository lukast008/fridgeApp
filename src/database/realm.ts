import Realm from 'realm';
import ActivityModel from './ActivityModel';
import ProductModel from './ProductModel';
import migrateLocalDB from "./migrations/migrations";
import Config from "react-native-config";
import ProductDefinitionModel from "./ProductDefinitionModel";
import ProductCategoryModel from "./ProductCategoryModel";
import ShoppingListItemModel from "./ShoppingListItemModel";

let localRealmInstance: Realm | void;
let syncApp: Realm.App | null;

const schema: Realm.ObjectSchema[] = [
  ProductDefinitionModel.schema,
  ProductModel.schema,
  ActivityModel.schema,
  ProductCategoryModel.schema,
  ShoppingListItemModel.schema
]

export async function openLocalRealm(path?: string) {
  if(localRealmInstance && !localRealmInstance.isClosed && !path) return localRealmInstance;
  else {
    const databaseOptions: Realm.Configuration = {
      path: path || 'fridgeApp.realm',
      schema: schema,
      schemaVersion: 17,
      migration: migrateLocalDB
    }
    localRealmInstance = new Realm(databaseOptions);
    if(localRealmInstance) return localRealmInstance;
    else throw "realm is not defined";
  }
}

export function getRealmApp() {
  if(!syncApp) {
    const appConfig = {
      id: Config.MONGO_APP_ID,
      timeout: 10000,
      schema: schema
    };
    syncApp = new Realm.App(appConfig);
  }
  return syncApp;
}

export async function openRealm(user: Realm.User | null) {
  return user ? openSyncRealm(user) : openLocalRealm();
}

async function openSyncRealm(user: Realm.User) {
  if(Config.MONGO_ENABLE_EXTERNAL === 'false') throw 'Sync session not enabled';
  let realm: Realm | void;

  const realmApp = getRealmApp();
  if(realmApp.currentUser && user.id === realmApp.currentUser.id) {
    //There is already logged in user
    realm = new Realm(getConfig(realmApp.currentUser));
  } else {
    // User is not logged in or new user logged in
    realm = await Realm.open(getConfig(user)).then(realm => {
      console.log("successfully connected to Realm with user: " + user.id);
      return realm;
    }).catch(err => {
      console.log("failed to open realm: ", err);
    });
  }

  if(realm) return realm;
  else throw "realm is not defined";
}

function getConfig(user: Realm.User) {
  return {
    sync: {
      user,
      partitionValue: user.id,
    }
  };
}
