import {useEffect, useRef, useState} from "react";
import ShoppingListItemDto from "../dto/ShoppingListItemDto";
import ShoppingListItemModel from "../database/ShoppingListItemModel";
import {UpdateMode} from "realm";
import DateUtils from "../utils/DateUtils";

export type ShoppingListProvider = {
  itemsToBuy: ShoppingListItemDto[] | null;
  boughtItems: ShoppingListItemDto[] | null;
  refreshLists: () => void;
  saveItem: (title: string) => Promise<ShoppingListItemDto>;
  updateItem: (title: string, item: ShoppingListItemDto) => Promise<void>;
  deleteItem: (item: ShoppingListItemDto) => Promise<void>;
  markItemAsChecked: (item: ShoppingListItemDto) => Promise<void>;
  markItemAsUnchecked: (item: ShoppingListItemDto) => Promise<void>;
  deleteItemByTitle: (title: string) => Promise<void>;
  markBoughtItemAsAdded: (title: string) => Promise<void>;
}

export default function useShoppingListProvider(realm: Realm | null, user: Realm.User | null): ShoppingListProvider {
  const [itemsToBuy, setItemsToBuy] = useState<ShoppingListItemDto[] | null>(null);
  const [boughtItems, setBoughtItems] = useState<ShoppingListItemDto[] | null>(null);
  const itemsToBuyRef = useRef<Realm.Results<ShoppingListItemDto & Realm.Object> | null>(null);
  const boughtItemsRef = useRef<Realm.Results<ShoppingListItemDto & Realm.Object> | null>(null);

  useEffect(() => {
    if(realm) {
      fetchItemsToBuy(realm);
      fetchBoughtItems(realm);
    }
    return () => {
      setItemsToBuy(null);
      setBoughtItems(null);
      if(itemsToBuyRef.current) itemsToBuyRef.current?.removeAllListeners();
      if(boughtItemsRef.current) boughtItemsRef.current?.removeAllListeners();
    }
  }, [realm]);

  function fetchItemsToBuy(realm: Realm) {
    try {
      const items = realm.objects<ShoppingListItemDto>(ShoppingListItemModel.schema.name)
        .filtered("isActive = TRUE AND purchaseDate = null")
        .sorted('creationDate');
      if(itemsToBuyRef.current) itemsToBuyRef.current?.removeAllListeners();
      itemsToBuyRef.current = items;
      items.addListener(items => {
        setItemsToBuy([...items]);
      });
    } catch (e) {
      console.log("ERROR -> failed to fetchItemsToBuy: ", e);
    }
  }

  function fetchBoughtItems(realm: Realm) {
    try {
      const items = realm.objects<ShoppingListItemDto>(ShoppingListItemModel.schema.name)
        .filtered("isActive = TRUE AND purchaseDate > $0 AND purchaseDate < $1",
          DateUtils.getStartDateOfDay(new Date()), DateUtils.getEndDateOfDay(new Date()))
        .sorted('purchaseDate', true);
      if(boughtItemsRef.current) boughtItemsRef.current?.removeAllListeners();
      boughtItemsRef.current = items;
      items.addListener(items => {
        setBoughtItems([...items]);
      });
    } catch (e) {
      console.log("ERROR -> failed to fetchBoughtItems: ", e);
    }
  }

  const refreshLists = () => {
    setItemsToBuy(null);
    setBoughtItems(null);
    if(realm) {
      fetchItemsToBuy(realm);
      fetchBoughtItems(realm);
    }
  }

  const saveItem = async (title: string) => {
    console.log("saveItem with title: " + title);
    if(realm) {
      const item = new ShoppingListItemDto(title);
      realm.write(() => {
        item.partitionKey = user?.id || "";
        realm.create(ShoppingListItemModel.schema.name, item, UpdateMode.All);
      });
      return item;
    } else {
      throw Error("Failed to save product category. Realm is null");
    }
  }

  const deleteItem = async (item: ShoppingListItemDto) => {
    if(realm) {
      const idToDelete = item._id;
      console.log("deleteItem: ", idToDelete);
      realm.write(() => {
        if(item.purchaseDate) boughtItems?.filter(item => item._id.equals(idToDelete)).forEach(item => realm.delete(item));
        else itemsToBuy?.filter(item => item._id.equals(idToDelete)).forEach(item => realm.delete(item));
      });
    } else {
      throw Error("Failed to delete item. Realm is null");
    }
  }

  const deleteItemByTitle = async (title: string) => {
    console.log("deleteItemByTitle: ", title);
    if(realm) {
      realm.write(() => {
        itemsToBuy?.filter(item => item.title === title).forEach(item => realm.delete(item));
      });
    } else {
      throw Error("Failed to delete item. Realm is null");
    }
  }

  const markBoughtItemAsAdded = async (title: string) => {
    console.log("markBoughtItemAsAdded: ", title);
    if(realm) {
      realm.write(() => {
        boughtItems?.filter(item => item.title === title).forEach(item => item.isActive = false);
      });
    } else {
      throw Error("Failed to delete item. Realm is null");
    }
  }

  const updateItem = async (title: string, item: ShoppingListItemDto) => {
    console.log("updateItem: ", item);
    if(realm) {
      realm.write(() => {
        item.title = title;
        realm.create(ShoppingListItemModel.schema.name, item, UpdateMode.All);
      });
    } else {
      throw Error("Failed to update item. Realm is null");
    }
  }

  const markItemAsChecked = async (item: ShoppingListItemDto) => {
    console.log("markItemAsChecked: ", item);
    if(realm) {
      realm.write(() => {
        item.purchaseDate = new Date();
        realm.create(ShoppingListItemModel.schema.name, item, UpdateMode.All);
      });
    } else {
      throw Error("Failed to mark item as checked. Realm is null");
    }
  }

  const markItemAsUnchecked = async (item: ShoppingListItemDto) => {
    console.log("markItemAsUnchecked: ", item);
    if(realm) {
      realm.write(() => {
        item.purchaseDate = null;
        item.creationDate = new Date();
        realm.create(ShoppingListItemModel.schema.name, item, UpdateMode.All);
      });
    } else {
      throw Error("Failed to mark item as unchecked. Realm is null");
    }
  }

  return { itemsToBuy, boughtItems, refreshLists, saveItem, updateItem, deleteItem,
    markItemAsChecked, markItemAsUnchecked, deleteItemByTitle, markBoughtItemAsAdded }
}
