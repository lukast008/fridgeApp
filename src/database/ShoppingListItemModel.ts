import Realm from 'realm';

export default class ShoppingListItemModel {
  static schema: Realm.ObjectSchema;
}

ShoppingListItemModel.schema = {
  name: "ShoppingListItem",
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    partitionKey: 'string',
    title: { type: 'string', indexed: true},
    isActive: 'bool',
    creationDate: 'date',
    purchaseDate: 'date?'
  }
}
