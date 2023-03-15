import React, {useEffect, useState} from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import ProductsList from '../layout/Product/ProductsList'
import ProductDto from '../../dto/Product/ProductDto'
import ProductOptionsModal from '../layout/ProductActions/ProductOptionsModal'
import TopHeader from '../layout/TopHeader/TopHeader'
import {useDefaultTranslation} from "../../utils/TranslationsUtils";
import {ParamList, Screens} from "../../navigation/Screens";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import ActionConfirmationPopup from "../layout/ProductActions/ActionConfirmationPopup";
import ActivityDto from "../../dto/ActivityDto";
import ProductListSettingsModal from "../layout/modals/ProductListSettingsModal";
import FloatingAddButton from "../layout/inputs/FloatingAddButton";

export default function ProductsScreen() {

  const { t } = useDefaultTranslation('product');

  const [isProductOptionsModalVisible, setIsProductOptionsModalVisible] = useState(false);
  const [isProductListSettingsModalVisible, setIsProductListSettingsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | undefined>(undefined);
  const [performedAction, setPerformedAction] = useState<ActivityDto | undefined>(undefined);
  const [productToScrollName, setProductToScrollName] = useState<string | undefined>(undefined);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProductsScreen'>>();

  useEffect(() => {
    console.log("Products screen UseEffect");
    if(route.params && route.params.productName) {
      console.log("route: ", route.params);
      setProductToScrollName(route.params.productName);
    } else {
      setProductToScrollName(undefined);
    }
  }, [route]);

  function onAddProduct() {
    const defId = selectedProduct && selectedProduct.definition._id.toString();
    navigation.navigate(Screens.ADD_PRODUCT_SCREEN, {
      "productId": null,
      "origin": Screens.PRODUCTS_SCREEN,
      "definitionId": defId
    });
    setSelectedProduct(undefined);
    setIsProductOptionsModalVisible(false);
  }

  function onEditProduct() {
    navigation.navigate(Screens.ADD_PRODUCT_SCREEN, {
      "productId": selectedProduct?._id,
      "origin": Screens.PRODUCTS_SCREEN
    });
    setSelectedProduct(undefined);
    setIsProductOptionsModalVisible(false);
  }

  function hideModals() {
    setIsProductOptionsModalVisible(false);
    setSelectedProduct(undefined);
  }

  function onActionPerformed(activity: ActivityDto) {
    console.log("onActionPerformed: " + activity._id);
    setPerformedAction(activity);
    setIsProductOptionsModalVisible(false);
    setSelectedProduct(undefined);
    setProductToScrollName(activity.product.definition.name);
  }

  function onProductSelected(productDefId: ObjectId) {
    console.log("onProductSelected: ", productDefId);
    hideModals();
    navigation.navigate(Screens.PRODUCT_SUMMARY_SCREEN, {
      "definitionId": productDefId
    });
  }

  function showProductOptionsModal(product: ProductDto) {
    setIsProductOptionsModalVisible(true);
    setSelectedProduct(product);
  }

  function filterProducts(txt: string) {
    setSearchValue(txt);
  }

  function render() {
    return (
      <View style={styles.container}>
        <TopHeader
          title={t("header")}
          isMainScreen={true}
          onSearchChange={filterProducts}
          onSettingsPress={() => setIsProductListSettingsModalVisible(true)}
        />
        <ProductsList
          searchValue={searchValue}
          onShowProductOptions={showProductOptionsModal}
          onAddProduct={onAddProduct}
          onProductSelected={onProductSelected}
          productToScroll={productToScrollName}
          onScrollExecuted={() => setProductToScrollName(undefined)}
        />
        {selectedProduct &&
          <ProductOptionsModal
              isVisible={isProductOptionsModalVisible}
              product={selectedProduct}
              onBackDropPress={hideModals}
              onEditPress={onEditProduct}
              onAddPress={onAddProduct}
              onActionPerformed={onActionPerformed}
              onProductSelected={onProductSelected}
          />
        }
        <FloatingAddButton onPress={onAddProduct} accessibilityLabel={'products-screen-add-button'} />
        <ActionConfirmationPopup activity={performedAction} onPopupHidden={() => setPerformedAction(undefined)} />
        <ProductListSettingsModal
          isVisible={isProductListSettingsModalVisible}
          onDismiss={() => setIsProductListSettingsModalVisible(false)} />
      </View>
    )
  }
  return render();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
});
