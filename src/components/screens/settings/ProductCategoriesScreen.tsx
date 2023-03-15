import React, {useCallback, useEffect, useState} from 'react'
import {View, StyleSheet, TouchableHighlight} from 'react-native'
import TopHeader from "../../layout/TopHeader/TopHeader";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import ProductCategoryDto from "../../../dto/Product/ProductCategoryDto";
import ProductCategoriesListItem from "../../layout/ProductCategories/ProductCategoriesItem";
import {useData} from "../../../providers/DataProvider";
import LoadingIndicator from "../../layout/common/LoadingIndicator";
import DraggableFlatList, {DragEndParams, RenderItemParams} from 'react-native-draggable-flatlist'
import COLORS from "../../../../assets/colors";
import {PopupDto, usePopup} from "../../../providers/PopupProvider";

export default function ProductCategoriesScreen() {

  const { t } = useDefaultTranslation('productCategories');
  const [selectedItem, setSelectedItem] = useState<ProductCategoryDto>();
  const [isNewItem, setIsNewItem] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { productCategoriesProvider } = useData();
  const { productCategories, saveProductCategory, deleteProductCategory, updateCategoriesOrder } = productCategoriesProvider;
  const [categories, setCategories] = useState(productCategories);
  const [isSaving, setIsSaving] = useState(false);
  const { openPopup, closePopup } = usePopup();

  useEffect(() => setCategories(productCategories), [productCategories]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  }

  const handleEditPress = (item: ProductCategoryDto) => {
    setSelectedItem(item);
    setIsNewItem(false);
  }

  const handleDeletePress = (item: ProductCategoryDto) => {
    const handleDelete = () => {
      setIsSaving(true);
      closePopup();
      setTimeout(() => {
        deleteProductCategory(item).then(() => {
          setSelectedItem(undefined);
          setIsSaving(false);
        });
      }, 50);
    }

    const popupDto: PopupDto = {
      title: t("confirm-delete.title"),
      content: t("confirm-delete.content", {name: item.name}),
      buttons: [
        { label: t("common:no"), onPress: closePopup },
        { label: t("common:yes"), onPress: handleDelete }
      ],
    }
    openPopup(popupDto);
  }

  const handleSavePress = (name: string) => {
    if(!selectedItem) return;
    saveProductCategory(selectedItem, name).then(() => {
      setSelectedItem(undefined);
      setIsNewItem(false);
    });
  }

  const handleCancelPress = () => {
    setSelectedItem(undefined);
    setIsNewItem(false);
  }

  const handleAddPress = () => {
    const newProductCategory = new ProductCategoryDto("");
    setIsNewItem(true);
    setSelectedItem(newProductCategory)
  }

  const isProductCategoryValid = (name: string) => {
    if(!name) return false;
    const existingProductCategory = categories.filter(item => item.name === name)[0];
    if(!existingProductCategory) return true;
    return existingProductCategory._id.equals(selectedItem?._id || '');
  }

  const renderDraggableItem = useCallback(({ item, index, drag, isActive }: RenderItemParams<ProductCategoryDto>) => {
    const backgroundColor = isActive ? COLORS.primary : COLORS.lightGray;
    return (
        <TouchableHighlight
          underlayColor={COLORS.primary}
          style={{backgroundColor}}
          onLongPress={!item.isDefault ? drag : undefined}>
          {renderItem(item)}
        </TouchableHighlight>
      );
    }, [selectedItem]);

  const renderItem = (item: ProductCategoryDto) => {
    const isEditMode: boolean = !!(selectedItem && selectedItem._id.equals(item._id));
    return (
      <ProductCategoriesListItem
        item={Object.assign(item)}
        isEditMode={isEditMode}
        onEditPress={handleEditPress}
        onDeletePress={handleDeletePress}
        onSavePress={handleSavePress}
        onCancelPress={handleCancelPress}
        isCategoryValid={isProductCategoryValid} />
    );
  }

  const renderNewItem = () => {
    if(isNewItem && selectedItem) return renderItem(selectedItem);
  }

  const handleDragEnd = (params: DragEndParams<ProductCategoryDto>) => {
    updateCategoriesOrder(params.data).then(result => setCategories(result));
  }

  return (
    <View style={styles.container}>
      <TopHeader
        title={selectedItem?.name || t("header")}
        isMainScreen={false}
        onSearchChange={selectedItem ? undefined : handleSearchChange}
        onAddPress={selectedItem ? undefined : handleAddPress}
      />
      {isSaving && <LoadingIndicator txt={''} />}
      {!isSaving &&
        <DraggableFlatList
            data={categories.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()))}
            renderItem={renderDraggableItem}
            keyExtractor={item => item._id.toString()}
            keyboardShouldPersistTaps={"always"}
            removeClippedSubviews={false}
            ListHeaderComponent={renderNewItem()}
            onDragEnd={handleDragEnd}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: COLORS.lightGray,
  }
});
