import React, {useState} from 'react'
import {View, StyleSheet, FlatList} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import TopHeader from "../../layout/TopHeader/TopHeader";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import ProductDefListItem from "../../layout/ProductLibrary/ProductDefListItem";
import ProductDefDto from "../../../dto/Product/ProductDefDto";
import {Screens} from "../../../navigation/Screens";
import {useData} from "../../../providers/DataProvider";

export default function ProductsLibraryScreen() {

  const { t } = useDefaultTranslation('productsLibrary');
  const navigation = useNavigation();
  const {productLibraryProvider} = useData();
  const {productDefs} = productLibraryProvider;
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  }

  const handleProductPress = (item: ProductDefDto) => {
    navigation.navigate(Screens.PRODUCT_SUMMARY_SCREEN, {"definitionId": item._id});
  }

  const handleEditPress = (item: ProductDefDto) => {
    navigation.navigate(Screens.PRODUCTS_LIBRARY_EDIT_SCREEN, {
      "productDefId": item._id,
      "origin": Screens.PRODUCTS_LIBRARY_SCREEN,
    });
  }

  const handleAddPress = () => {
    navigation.navigate(Screens.PRODUCTS_LIBRARY_EDIT_SCREEN, {"origin": Screens.PRODUCTS_LIBRARY_SCREEN});
  }

  const renderItem = ({ item }: { item: ProductDefDto }) => {
    return (
      <ProductDefListItem
        item={item}
        isEditMode={false}
        onProductPress={handleProductPress}
        onEditPress={handleEditPress}/>
    );
  }

  return (
    <View style={styles.container}>
      <TopHeader
        title={t("header")}
        isMainScreen={false}
        onSearchChange={handleSearchChange}
        onAddPress={handleAddPress}
      />
      <FlatList
        data={productDefs.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()))}
        renderItem={renderItem}
        keyExtractor={item => item._id.toString()}
        keyboardShouldPersistTaps={"always"}
        removeClippedSubviews={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  }
});
