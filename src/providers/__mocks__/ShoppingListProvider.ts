import {realmMock} from "../../database/__mocks__/realm";
import ShoppingListItemDto from "../../dto/ShoppingListItemDto";
import DateUtils from "../../utils/DateUtils";
import useShoppingListProvider from "../ShoppingListProvider";

const recalculateItems = (newItems: any[]) => {
  items = newItems;
  itemsToBuy = items.filter((item: ShoppingListItemDto) => item.isActive && !item.purchaseDate);
  boughtItems = items.filter((item: ShoppingListItemDto) => item.isActive && item.purchaseDate && item.purchaseDate < DateUtils.getEndDateOfDay(new Date()));
}

let items: any[] = [];
let itemsToBuy: any[] = [];
let boughtItems: any[] = [];
recalculateItems(realmMock.data["ShoppingListItem"]);

export const mockShoppingListProvider = () => {
  const currentItems = realmMock.data["ShoppingListItem"];
  if(JSON.stringify(items) !== JSON.stringify(currentItems)) {
    recalculateItems(currentItems);
  }
  return {
    // @ts-ignore
    ...useShoppingListProvider(realmMock, null),
    itemsToBuy: itemsToBuy,
    boughtItems: boughtItems
  }
}
