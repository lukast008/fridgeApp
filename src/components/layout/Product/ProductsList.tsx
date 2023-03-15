import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, FlatList, StyleSheet, ScrollView, RefreshControl, LogBox} from 'react-native';
import ProductCard from './ProductCard';
import ProductDto from '../../../dto/Product/ProductDto';
import {T1, T3} from "../Text/Text";
import {Icon} from "react-native-elements";
import COLORS from "../../../../assets/colors";
import {useData} from "../../../providers/DataProvider";
import {productService} from "../../../service/ProductService";
import LoadingIndicator from "../common/LoadingIndicator";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import ConnectionStatusIndicator from "../common/ConnectionStatusIndicator";
import ProductGroupDto from "../../../dto/Product/ProductGroupDto";
import CategoryWithProductsListItem from "./CategoryWithProductsListItem";

type Props = {
  searchValue: string;
  onShowProductOptions: (product: ProductDto) => void;
  onAddProduct: () => void;
  onProductSelected: (productDefId: ObjectId) => void;
  productToScroll?: string;
  onScrollExecuted: () => void;
}

export default function ProductsList(props: Props) {

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnectionStateVisible, setIsConnectionStateVisible] = useState(false);
  const {products, initProducts, connectionStatus} = useData();
  const { t } = useDefaultTranslation('product');
  const { productCategoriesProvider, localStateProvider, shoppingListProvider } = useData();

  const { productCategories } = productCategoriesProvider;
  const isGroupedByCategory = localStateProvider.groupProductsWithCategories;
  const { itemsToBuy } = shoppingListProvider;

  useEffect(() => {
    // TODO issue with nested flatlists. In this situation should not be a problem.
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, [])


  const groupedProducts = useMemo(() => {
    if(!products) return [];
    console.log("grouping products");
    try {
      return productService.groupProductsByNameAndUnit(products.filter(item =>
        item.definition.name.toLowerCase().includes(props.searchValue.toLowerCase()))
      );
    } catch (e) {
      console.log("ERROR in groupedProducts: ", e);
      return [];
    }
  }, [products, props.searchValue]);

  const groupedProductsWithShoppingInfo = useMemo(() => {
    if(!groupedProducts) return [];
    if(!itemsToBuy) return groupedProducts;
    try {
      console.log("adding shopping info to grouped products");
      return groupedProducts.map(item => {
        return {
          ...item,
          isOnShoppingList: itemsToBuy.filter(shoppingItem => shoppingItem.title === item.name).length > 0
        };
      });
    } catch (e) {
      console.log("ERROR in groupedProductsWithShoppingInfo: ", e);
      return [];
    }
  }, [groupedProducts, itemsToBuy]);

  const productsWithCategories = useMemo(() => {
    if(!isGroupedByCategory) return [];
    try {
      return productService.groupProductsByCategories(productCategories, groupedProductsWithShoppingInfo);
    } catch (e) {
      console.log("ERROR in productsWithCategories: ", e);
      return [];
    }
  }, [productCategories, groupedProductsWithShoppingInfo, isGroupedByCategory]);

  function onRefresh() {
    setIsRefreshing(true);
    setIsConnectionStateVisible(true);
    initProducts().then(() => {
      setIsRefreshing(false);
      setTimeout(() => setIsConnectionStateVisible(false), 3000);
    });
  }

  function renderEmptyList() {
    return (
      <View style={styles.emptyListContainer}>
        <T1 style={{textAlign: "center"}}>{t("noProductsLine1")}</T1>
        <T3 style={{textAlign: "center"}}>{t("noProductsLine2")}</T3>
        <Icon reverse name={'add'} size={26} color={COLORS.primary} onPress={props.onAddProduct}/>
      </View>
    )
  }

  function renderGroupedProducts(groupedProducts: ProductGroupDto[]) {
    return (
      <FlatList
        data={groupedProducts}
        renderItem={({item}) => (
          <ProductCard product={item} showProductOptions={props.onShowProductOptions} onProductSelected={props.onProductSelected}/>
        )}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={renderEmptyList()}
        keyboardShouldPersistTaps="always"
        initialNumToRender={10}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
      />
    );
  }

  const renderProductsWithCategories = useCallback(() => {
    if(productsWithCategories.length === 0) return renderEmptyList();
    return (
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="always"
      >
        {productsWithCategories.map(productCategory =>
          <CategoryWithProductsListItem
            key={productCategory.name}
            category={productCategory}
            renderGroupedProducts={renderGroupedProducts}/>
        )}
      </ScrollView>
    );
  }, [productsWithCategories]);

  function renderList() {
    return isGroupedByCategory ? renderProductsWithCategories() : renderGroupedProducts(groupedProductsWithShoppingInfo);
  }

  if(products === null || localStateProvider.groupProductsWithCategories === undefined) return <LoadingIndicator txt={t("loadingInfo")} />
  return (
    <View style={styles.container}>
      {renderList()}
      <ConnectionStatusIndicator connectionStatus={connectionStatus} isVisible={isConnectionStateVisible} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyListContainer: {
    margin: 30,
    alignItems: "center",
  },
  spacer: {
    height: 40,
  }
});
