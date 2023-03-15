import Realm from 'realm';
import ProductCategoryModel from "./ProductCategoryModel";

export default class ProductDefinitionModel extends Realm.Object {
  static schema: Realm.ObjectSchema;
}

ProductDefinitionModel.schema = {
  name: "ProductDefinition",
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    partitionKey: 'string',
    name: { type: 'string', indexed: true},
    iconName: 'string',
    unitName: 'string',
    category: { type: ProductCategoryModel.schema.name, optional: true },
    isActive: 'bool',
    creationDate: 'date'
  }
}
