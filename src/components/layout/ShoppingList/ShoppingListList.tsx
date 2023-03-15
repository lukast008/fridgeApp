import React, {useCallback, useEffect, useState} from 'react';
import ShoppingListItemDto, {cloneShoppingListItemDto} from "../../../dto/ShoppingListItemDto";
import styled from "styled-components/native";
import ShoppingListItem from "./ShoppingListItem";
import ShoppingListNewItem from "./ShoppingListNewItem";
import COLORS from "../../../../assets/colors";
import {T2} from "../Text/Text";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import LoadingIndicator from "../common/LoadingIndicator";
import {RefreshControl} from "react-native";
import {useData} from "../../../providers/DataProvider";

const Container = styled.ScrollView`
  padding: 5px 10px 0 15px;
  background-color: ${COLORS.lightGray};
`;

const InfoLine = styled.View`
  margin: 15px 0 10px 0;
  border-color: ${COLORS.textTitle};
  border-top-width: 2px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Header = styled(T2)`
  color: ${COLORS.textTitle};
  position: absolute;
  padding: 0 5px;
  background-color: ${COLORS.lightGray};
`;

const ShoppingListList = () => {

  const { shoppingListProvider } = useData();
  const { itemsToBuy, boughtItems, refreshLists, saveItem, updateItem, deleteItem, markItemAsChecked, markItemAsUnchecked } = shoppingListProvider;
  const { t } = useDefaultTranslation("shoppingList");

  const [itemsToBuyTemp, setItemsToBuyTemp] = useState<ShoppingListItemDto[]>([]);
  const [boughtItemsTemp, setBoughtItemsTemp] = useState<ShoppingListItemDto[]>([]);

  useEffect(() => {
    if(itemsToBuy) setItemsToBuyTemp(itemsToBuy.map(item => cloneShoppingListItemDto(item)));
  }, [itemsToBuy]);

  useEffect(() => {
    if(boughtItems) setBoughtItemsTemp(boughtItems.map(item => cloneShoppingListItemDto(item)));
  }, [boughtItems]);

  const handleItemEdited = (title: string, item: ShoppingListItemDto) => {
    console.log("item edited: " + title);
    updateItem(title, item);
  }

  const handleItemAdded = (title: string) => {
    console.log("item added: " + title);
    !!title && saveItem(title);
  }

  const handleItemDeleted = (deletedItem: ShoppingListItemDto) => {
    console.log("item deleted: ", deletedItem);
    if(deletedItem.purchaseDate) {
      setBoughtItemsTemp(boughtItemsTemp.filter(item => !item._id.equals(deletedItem._id)));
    } else {
      setItemsToBuyTemp(itemsToBuyTemp.filter(item => !item._id.equals(deletedItem._id)));
    }
    setTimeout(() => deleteItem(deletedItem), 100);
  }

  const handleCheckPressed = (isChecked: boolean, item: ShoppingListItemDto) => {
    console.log("check pressed: " + isChecked);
    if(isChecked) {
      item.purchaseDate = new Date();
      setItemsToBuyTemp(itemsToBuyTemp.filter(i => !i._id.equals(item._id)));
      setBoughtItemsTemp([item, ...boughtItemsTemp]);
      setTimeout(() => markItemAsChecked(item), 100);
    } else {
      item.purchaseDate = null;
      item.creationDate = new Date();
      setBoughtItemsTemp(boughtItemsTemp.filter(i => !i._id.equals(item._id)));
      setItemsToBuyTemp([...itemsToBuyTemp, item]);
      setTimeout(() => markItemAsUnchecked(item), 100);
    }
  }

  const renderItemsToBuy = useCallback(
    () => {
      return itemsToBuyTemp && itemsToBuyTemp.map(item =>
        <ShoppingListItem
          item={item}
          key={item._id.toHexString()}
          onEndEditing={handleItemEdited}
          onDelete={handleItemDeleted}
          onCheckPressed={handleCheckPressed} />
      )
    }, [itemsToBuyTemp],
  );

  const renderBoughtItems = useCallback(
    () => {
      return boughtItemsTemp && boughtItemsTemp.map(item =>
        <ShoppingListItem
          item={item}
          key={"b_" + item._id.toHexString()}
          onEndEditing={handleItemEdited}
          onDelete={handleItemDeleted}
          onCheckPressed={handleCheckPressed} />
      )
    }, [boughtItemsTemp],
  );

  if(itemsToBuyTemp == null || boughtItemsTemp == null) return <LoadingIndicator txt={t("loadingInfo")} />;
  return (
    <Container
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={false} onRefresh={refreshLists} />}
    >
      {renderItemsToBuy()}

      <ShoppingListNewItem onEndEditing={handleItemAdded} />
      {!!boughtItemsTemp && boughtItemsTemp.length > 0 &&
        <InfoLine>
          <Header>{t("boughTodayLabel")}</Header>
        </InfoLine>
      }

      {renderBoughtItems()}
    </Container>
  );
};

export default ShoppingListList;

