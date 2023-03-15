import Realm from 'realm';
import ProductModel from "./ProductModel";

export default class ActivityModel extends Realm.Object {
  static schema: Realm.ObjectSchema;
}

ActivityModel.schema = {
  name: "Activity",
  primaryKey: '_id',
  properties: {
    _id: 'string',
    partitionKey: 'string',
    actionDate: 'date',
    actionType: 'string',
    unitValue: 'double',
    product: ProductModel.schema.name,
    isActive: {type: 'bool', default: true},
    creationDate: 'date',
  }
}
