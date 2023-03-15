import React, {useEffect, useMemo, useState} from 'react'
import {View, StyleSheet, ScrollView, LogBox, RefreshControl} from 'react-native'
import TopHeader from "../layout/TopHeader/TopHeader";
import {useDefaultTranslation} from "../../utils/TranslationsUtils";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {ParamList, Screens} from "../../navigation/Screens";
import {useData} from "../../providers/DataProvider";
import ProductDto from "../../dto/Product/ProductDto";
import SummaryHeader from "../layout/ProductSummary/SummaryHeader";
import SummaryProductsList from '../layout/ProductSummary/SummaryProductsList';
import ProductOptionsModal from "../layout/ProductActions/ProductOptionsModal";
import {statisticsService} from "../../service/StatisticsService";
import SummaryStatistics from "../layout/ProductSummary/SummaryStatistics";
import LoadingIndicator from "../layout/common/LoadingIndicator";
import {productService} from "../../service/ProductService";
import COLORS from "../../../assets/colors";
import {H2} from "../layout/Text/Header";
import SummaryActivitiesList from "../layout/ProductSummary/SummaryActivitiesList";
import {T1} from "../layout/Text/Text";
import {useActivitiesForProductDefId} from "../../providers/ActivitiesProvider";

export default function ProductSummaryScreen() {

  const { t } = useDefaultTranslation('productSummary');
  const navigation = useNavigation();
  const {products, getProductDefById, initProducts} = useData();

  const route = useRoute<RouteProp<ParamList, 'ProductSummary'>>();

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isProductOptionsModalVisible, setIsProductOptionsModalVisible] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | undefined>(undefined);
  const [highlightedProduct, setHighlightedProduct] = useState<ProductDto | undefined>(undefined);

  const productDef = useMemo(() => {
    if(route.params && route.params.definitionId) {
      return getProductDefById(route.params.definitionId);
    }
  }, [route]);

  const activities = useActivitiesForProductDefId(productDef?._id);

  const filteredProducts = useMemo(() => {
    if(!products || !productDef) return null;
    return products.filter(product => product.definition._id.equals(productDef._id));
  },[products, productDef]);

  useEffect(() => {
    // TODO probably better way would be to use RecyclerList instead of FlatLists
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
  }, [])


  function onRefresh() {
    if(productDef) {
      setIsRefreshing(true);
      initProducts().then(() => setIsRefreshing(false));
    }
  }

  function hideModals() {
    setSelectedProduct(undefined);
    setIsProductOptionsModalVisible(false);
  }

  function onProductSelected(product: ProductDto) {
    setSelectedProduct(product);
    setIsProductOptionsModalVisible(true);
  }

  function onProductHighlighted(product: ProductDto) {
    if(highlightedProduct && highlightedProduct._id === product._id) setHighlightedProduct(undefined);
    else setHighlightedProduct(product);
  }

  function onEditPress() {
    navigation.navigate(Screens.ADD_PRODUCT_SCREEN, {
      "productId": selectedProduct?._id,
      "origin": Screens.PRODUCT_SUMMARY_SCREEN
    });
    setIsProductOptionsModalVisible(false);
    setSelectedProduct(undefined);
  }

  function onAddPress() {
    navigation.navigate(Screens.ADD_PRODUCT_SCREEN, {
      "definitionId": productDef?._id,
    });
    setIsProductOptionsModalVisible(false);
    setSelectedProduct(undefined);
  }

  function onEditProductDefPress() {
    if(!productDef) return;
    navigation.navigate(Screens.PRODUCTS_LIBRARY_EDIT_SCREEN, {
      "productDefId": productDef._id,
      "origin": Screens.PRODUCT_SUMMARY_SCREEN,
    });
  }

  function renderProducts() {
    if(!filteredProducts) return <LoadingIndicator txt={t("loadingProductsInfo")}/>
    if(filteredProducts.length === 0) return <></>
    else {
      return (
        <>
          <SummaryHeader products={filteredProducts} />
          <SummaryProductsList
            products={filteredProducts}
            onProductPress={onProductSelected}
            highlightedProduct={highlightedProduct}
            onProductHighlighted={onProductHighlighted}
          />
        </>
      )
    }
  }

  function renderStatistics() {
    if(!activities) return <LoadingIndicator txt={t("loadingStatisticsInfo")}/>
    if(activities.length > 0) {
      const statisticsData = statisticsService.groupStatistics(activities)[0];
      return (
        <>
          <H2 style={styles.header}>{t("statisticsLabel")}</H2>
          <SummaryStatistics statistics={statisticsData} />
        </>
      );
    }
  }

  function renderHistory() {
    if(!activities) return <LoadingIndicator txt={t("loadingHistoryInfo")}/>;
    if(activities.length > 0) {
      const groupedActivities = productService.groupActivityByDay(activities);
      return (
        <>
          <H2 style={styles.header}>{t("historyLabel")}</H2>
          <SummaryActivitiesList activities={groupedActivities} highlightedProduct={highlightedProduct} />
        </>
      );
    }
  }

  function renderOptionsModal() {
    if(selectedProduct) {
      return (
        <ProductOptionsModal
          isVisible={isProductOptionsModalVisible}
          product={selectedProduct}
          onBackDropPress={hideModals}
          onEditPress={onEditPress}
          onAddPress={onAddPress}
          onActionPerformed={hideModals}
        />
      );
    }
  }

  return (
    <View style={styles.container}>
      <TopHeader
        title={productDef?.name || ""}
        isMainScreen={false}
        onAddPress={onAddPress}
        onEditPress={onEditProductDefPress}
      />
      {activities && activities.length === 0 && <T1 style={styles.noProductInfo}>{t("noProductInfo")}</T1>}
      <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
        {renderProducts()}
        {renderStatistics()}
        {renderHistory()}
        {renderOptionsModal()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
  header: {
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  noProductInfo: {
    textAlign: "center",
    marginTop: 10
  }
});
