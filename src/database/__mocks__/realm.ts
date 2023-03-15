import Realm from "realm";

export default class RealmMock {
  data: any = {
    "ShoppingListItem": []
  };
  listeners: any = {
    "ShoppingListItem": []
  }

  init(schemaName: any, values: any[]) {
    this.data[schemaName] = values;
  }

  objects<T>(schemaName: any, query?: string, ...arg: any[]) {
    const data = this.data[schemaName];
    let objects = data;

    objects.values = () => objects;
    objects.filtered = (query: string, ...arg: any[]) => objects;
    objects.sorted = () => objects
    objects.addListener = (fn: (items: any) => void) => {
      this.listeners[schemaName].push(fn);
      fn(objects);
    }
    objects.removeAllListeners = () => {}
    return objects;
  }

  write(fn: any) {
    console.log("MOCK -> realm -> write");
    fn();
  }

  create(schemaName: any, object: any, mode?: any) {
    console.log("MOCK -> realm -> create schemaName: " + schemaName);
    let updated = false;
    this.data[schemaName] = this.data[schemaName].map((item: any) => {
      if(item._id.equals(object._id)) {
        updated = true;
        return object;
      }
      return item;
    });
    if(!updated) {
      console.log("MOCK -> realm -> create -> adding new item");
      this.data[schemaName].push(object);
    } else {
      console.log("MOCK -> realm -> create -> updating existing item");
    }
    this.listeners[schemaName].forEach((fn: any) => fn(this.data[schemaName]));
    return object;
  }

  delete(item: any) {
    console.log("MOCK -> realm -> delete item: ", item);
    // TODO make more generic
    this.data["ShoppingListItem"] = this.data["ShoppingListItem"].filter((x: any) => x._id.toString() !== item._id.toString());
  }

  addListener(event: any, callback: any) {

  }

  removeAllListeners() {

  }
};

export enum UpdateMode {
  Never = 'never',
  Modified = 'modified',
  All = 'all'
}

export function getRealmApp() {
  return new RealmMock();
}

export async function openRealm(user: Realm.User | null) {
  return new RealmMock();
}

export const realmMock = new RealmMock();
