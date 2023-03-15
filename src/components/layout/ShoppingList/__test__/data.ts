import ShoppingListItemDto from "../../../../dto/ShoppingListItemDto";
export const MOCK_ITEMS_TO_BUY = [...Array(5)].map((value, index) => new ShoppingListItemDto('test ' + (index + 1)));
export const MOCK_ITEMS_BOUGHT = [...Array(10)].map(
  (value, index) => {
    const item = new ShoppingListItemDto('test_b ' + (index + 1));
    item.purchaseDate = new Date();
    return item;
  }
);
