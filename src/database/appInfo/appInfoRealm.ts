import Realm from 'realm';
import LogModel from "./LogModel";
import migrateAppInfoDB from "./migrations";

let localRealmInstance: Realm | void;

const schema: Realm.ObjectSchema[] = [
  LogModel.schema
]

export async function openLocalAppInfoRealm() {
  if(localRealmInstance && !localRealmInstance.isClosed) return localRealmInstance;
  else {
    const databaseOptions: Realm.Configuration = {
      path: 'fridgeAppInfo.realm',
      schema: schema,
      schemaVersion: 2,
      migration: migrateAppInfoDB
    }
    localRealmInstance = new Realm(databaseOptions);
    if(localRealmInstance) return localRealmInstance;
    else throw "appInfo realm is not defined";
  }
}
