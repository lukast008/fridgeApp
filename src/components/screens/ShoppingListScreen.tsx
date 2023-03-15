import React from 'react'
import TopHeader from '../layout/TopHeader/TopHeader'
import {useDefaultTranslation} from "../../utils/TranslationsUtils";
import {ScreenContainer} from "../layout/common/Containers";
import ShoppingListList from "../layout/ShoppingList/ShoppingListList";

export default function ShoppingListScreen() {
  const { t } = useDefaultTranslation('shoppingList');
  return (
    <ScreenContainer>
      <TopHeader title={t("header")} isMainScreen={true}/>
      <ShoppingListList />
    </ScreenContainer>
  );
}
