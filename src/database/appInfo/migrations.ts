import LogModel from "./LogModel";
import LogDto from "../../dto/AppInfo/LogDto";
import {ObjectId} from "bson";

export default function migrateAppInfoDB(oldRealm: Realm, newRealm: Realm) {
  console.log("migrate appInfo DB. Current version: " + oldRealm.schemaVersion);
  if(oldRealm.schemaVersion < 2) {
    console.log("*** migrating to version 2 - change _id from string to ObjectId");
    const newLogs = newRealm.objects<LogDto>(LogModel.schema.name);
    for (let i=0; i<newLogs.length; i++) {
      newLogs[i]._id = new ObjectId();
    }
  }
}
