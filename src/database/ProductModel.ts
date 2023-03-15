import Realm from 'realm';
import ProductDefinitionModel from "./ProductDefinitionModel";

export default class ProductModel extends Realm.Object {
  static schema: Realm.ObjectSchema;
}

ProductModel.schema = {
  name: "Product",
  primaryKey: '_id',
  properties: {
    _id: 'string',
    partitionKey: 'string',
    description: 'string',
    unitValue: 'double',
    initialUnitValue: 'double',
    massValuePerUnit: 'double?',
    expirationDate: 'date',
    isActive: {type: 'bool', default: true},
    creationDate: 'date',
    openingDate: 'date?',
    definition: ProductDefinitionModel.schema.name
  }
}
