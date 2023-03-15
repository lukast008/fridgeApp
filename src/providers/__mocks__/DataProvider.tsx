import { mockShoppingListProvider } from "./ShoppingListProvider";

export const useData = () => {
  return {
    shoppingListProvider: mockShoppingListProvider()
  };
}
