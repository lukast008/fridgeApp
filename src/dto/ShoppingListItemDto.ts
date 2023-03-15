import {ObjectId} from "bson";

export default class ShoppingListItemDto {
  _id: ObjectId;
  partitionKey: string;
  title: string;
  isActive: boolean;
  purchaseDate?: Date | null;
  creationDate: Date;

  constructor(title: string) {
    this._id = new ObjectId();
    this.title = title;
    this.isActive = true;
    this.creationDate = new Date();
  }
}

export const cloneShoppingListItemDto = (item: ShoppingListItemDto): ShoppingListItemDto => {
  return {
    _id: item._id,
    partitionKey: item.partitionKey,
    title: item.title,
    isActive: item.isActive,
    purchaseDate: item.purchaseDate,
    creationDate: item.creationDate
  }
}
