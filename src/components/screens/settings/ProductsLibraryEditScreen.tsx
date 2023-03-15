import React, {useEffect, useState} from 'react'
import {View, StyleSheet} from 'react-native'
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import TopHeader from "../../layout/TopHeader/TopHeader";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import ProductDefListItem from "../../layout/ProductLibrary/ProductDefListItem";
import ProductDefDto from "../../../dto/Product/ProductDefDto";
import {unitService} from "../../../service/UnitService";
import IconService from "../../../service/IconService";
import {ParamList} from "../../../navigation/Screens";
import {useData} from "../../../providers/DataProvider";
import ButtonWithLabel from "../../layout/inputs/ButtonWithLabel";
import {T3} from "../../layout/Text/Text";
import COLORS from "../../../../assets/colors";

export default function ProductsLibraryEditScreen() {

  const { t } = useDefaultTranslation('productsLibrary');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProductsLibraryEditScreen'>>();
  const [initialProduct, setInitialProduct] = useState<ProductDefDto>();
  const [editedProduct, setEditedProduct] = useState<ProductDefDto>();
  const {productLibraryProvider, getProductsByDefId} = useData();
  const {productDefs, saveProductDefinition, archiveProductDefinition} = productLibraryProvider;
  const [isSaving, setIsSaving] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [currentAmountOfProduct, setCurrentAmountOfPoduct] = useState(0);

  useEffect(() => {
    if(route.params && route.params.productDefId) {
      setInitialProduct(productDefs.filter(p => p._id.equals(route.params.productDefId))[0]);
      calculateAmountOfProducts(route.params.productDefId);
    } else {
      const defaultUnitName = unitService.getDefaultUnit().name;
      const defaultIconName = IconService.getDefaultIcon().name;
      const newProductDef = new ProductDefDto("", defaultUnitName, defaultIconName);
      setInitialProduct(newProductDef);
    }
  }, [route]);

  const calculateAmountOfProducts = async (productDefId: ObjectId) => {
    const products = await getProductsByDefId(productDefId);
    const sum = products.reduce((a, b) => a + b.unitValue, 0);
    setCurrentAmountOfPoduct(sum);
  }

  const handleSavePress = () => {
    if(!editedProduct) return;
    setIsSaving(true);
    setTimeout(() => {
      saveProductDefinition(editedProduct).then(() => {
        if(route.params && route.params.origin) navigation.navigate(route.params.origin, {name: editedProduct.name});
      });
    }, 50);
  }

  const handleArchivePress = async () => {
    if(!initialProduct || currentAmountOfProduct > 0) return;
    setIsArchiving(true);
    setTimeout(() => {
      archiveProductDefinition(initialProduct).then(() => {
        if(route.params && route.params.origin) navigation.navigate(route.params.origin);
      });
    }, 50);
  }

  const handleProductChanged = (productDefDto: ProductDefDto) => setEditedProduct(productDefDto);

  const isProductChanged = () => {
    if(!editedProduct || !initialProduct) return false;
    return editedProduct.name !== initialProduct.name
      || editedProduct.iconName !== initialProduct.iconName
      || editedProduct.unitName !== initialProduct.unitName
      || editedProduct.category?._id !== initialProduct.category?._id
  }

  const isEditedProductValid = () => {
    if(!editedProduct) return false;
    if(!editedProduct.name || !editedProduct.unitName) return false;
    if(!isProductChanged()) return false;
    const existingProductDef = productDefs
      .filter(item => item.name === editedProduct.name && item.unitName === editedProduct.unitName)[0];
    if(!existingProductDef) return true;
    return existingProductDef._id.equals(initialProduct?._id || '');
  }

  const renderAmountOfProduct = () => {
    if(!currentAmountOfProduct || !initialProduct) return <></>;
    const unitName = unitService.getUnitNameForNumber(initialProduct.unitName, currentAmountOfProduct);
    return (
      <View style={styles.productInfo}>
        <T3>{t("current-amount")} {currentAmountOfProduct} {unitName}</T3>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TopHeader title={initialProduct?.name || ''} isMainScreen={false}/>
      {initialProduct &&
        <>
          <ProductDefListItem
            item={initialProduct}
            isEditMode={true}
            onProductChanged={handleProductChanged}
          />
          {renderAmountOfProduct()}
          <ButtonWithLabel
            label={t("common:save")}
            onPress={handleSavePress}
            isDisabled={!isEditedProductValid()}
            isLoading={isSaving}
          />
          <ButtonWithLabel
            label={t("common:archive")}
            onPress={handleArchivePress}
            isDisabled={!!currentAmountOfProduct}
            isLoading={isArchiving}
          />
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
  productInfo: {
    backgroundColor: COLORS.background,
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 15,
    padding: 5,
  }
});
