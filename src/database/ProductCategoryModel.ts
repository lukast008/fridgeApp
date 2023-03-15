import Realm from 'realm';

export default class ProductCategoryModel extends Realm.Object {
  static schema: Realm.ObjectSchema;
}

ProductCategoryModel.schema = {
  name: "ProductCategory",
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    partitionKey: 'string',
    name: { type: 'string', indexed: true},
    isActive: 'bool',
    isDefault: 'bool',
    order: 'int?',
    creationDate: 'date'
  }
}
