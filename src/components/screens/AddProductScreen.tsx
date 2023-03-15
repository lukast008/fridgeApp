import React, {useEffect, useState} from 'react'
import {ScrollView} from 'react-native'
import TopHeader from '../layout/TopHeader/TopHeader'
import {useDefaultTranslation} from "../../utils/TranslationsUtils";
import InputRowWithLabel from "../layout/inputs/InputRowWithLabel";
import DateUtils from "../../utils/DateUtils";
import ExpirationDatePicker from "../layout/modals/ExpirationDatePicker";
import ProductSuggestionDto from "../../dto/Product/ProductSuggestionDto";
import ProductDto from "../../dto/Product/ProductDto";
import {useData} from "../../providers/DataProvider";
import { useNavigation, useRoute, RouteProp  } from '@react-navigation/native';
import {ParamList, Screens} from "../../navigation/Screens";
import BottomButton from "../layout/inputs/BottomButton";
import ProductDefDto from "../../dto/Product/ProductDefDto";
import ProductCategoryPicker from "../layout/modals/ProductCategoryPicker";
import UnitAndMassInput from "../layout/AddProduct/UnitAndMassInput";
import {useAddProductReducer} from "../layout/AddProduct/addProduct.reducer";
import NameAndIconInput from "../layout/AddProduct/NameAndIconInput";
import ProductSuggestionsList from "../layout/Product/ProductSuggestionsList";
import styled from "styled-components/native";
import {ScreenContainer} from "../layout/common/Containers";
import {InputRow, RowTextInput} from '../layout/inputs/common';
import ActionDatePicker from "../layout/modals/ActionDatePicker";
import {useLogger} from "../../providers/AppInfoProvider";

const Container = styled(ScreenContainer)`
  padding-bottom: 80px;
`;

export default function AddProductScreen() {

  const { t } = useDefaultTranslation('addProduct');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'AddProductScreen'>>();
  const { saveProduct, getProductById, fetchProductSuggestions, shoppingListProvider, productLibraryProvider } = useData();
  const { logger } = useLogger("AddProductScreen");

  const {state, setName, setDescription, setExpirationDate, setActionDate, setUnit, setUnitValue, setMassValue, setIcon,
    setCategory, setProductDefId, setProductDefLibrary, setProduct, setProductSuggestion} = useAddProductReducer();

  const [productSuggestions, setProductSuggestions] = useState<ProductSuggestionDto[]>([]);
  const {productDefs, saveProductDefinition} = productLibraryProvider;
  const {markBoughtItemAsAdded} = shoppingListProvider;

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => setProductDefLibrary(productDefs), [productDefs]);

  useEffect(() => {
    fetchProductSuggestions().then(suggestions => {
      setProductSuggestions(suggestions);
      if(route.params) {
        logger.info("Open AddProduct Screen with params: ", route.params);
        if(route.params.productId) {
          setProduct(getProductById(route.params.productId));
        } else if (route.params.definitionId) {
          setProductDefId(route.params.definitionId);
        } else if (route.params.name) {
          const matchingProducts = suggestions.filter(product => product.productDef.name.toLowerCase() === route.params.name.toLowerCase());
          if(matchingProducts.length === 1) setProductSuggestion(matchingProducts[0]);
          else setName(route.params.name);
        }
      }
    });
  }, [route]);

  const onSavePress = () => {
    setIsSaving(true);
    setTimeout(() => {
      handleSaveProduct().then(() => {
        const nextScreen = route.params.origin ? route.params.origin :  Screens.PRODUCTS_SCREEN;
        navigation.navigate(nextScreen, {"productName": state.name});
        setIsSaving(false);
      });
    }, 50);
  }

  const onEditPressed = () => {
    if(state.selectedProductDef) {
      navigation.navigate(Screens.PRODUCTS_LIBRARY_EDIT_SCREEN, {
        "productDefId": state.selectedProductDef._id,
        "origin": Screens.ADD_PRODUCT_SCREEN,
      });
    }
  }

  async function handleSaveProduct() {
    if(state.isValid) {
      try {
        const productDefDto = state.selectedProductDef || await saveProductDefinition(new ProductDefDto(state.name, state.unit.name, state.icon.name, state.category));
        const expDate = state.expirationDate ? state.expirationDate : DateUtils.getInfinitDate();
        const productDto = new ProductDto(state.description, state.unitValue, expDate, state.actionDate, productDefDto);
        if(state.massValue) productDto.massValuePerUnit = state.massValue;

        if(state.id) productDto._id = state.id;
        const isNew: boolean = !state.id;
        await saveProduct(productDto, isNew);
        await markBoughtItemAsAdded(state.name);
      } catch(error) {
        console.warn("Failed to save product: ", error);
      }
    } else {
      // TODO
    }
  }

  return (
    <Container>
      <TopHeader
        title={t("header")}
        isMainScreen={false}
        onEditPress={state.selectedProductDef && onEditPressed}
      />
      <ScrollView keyboardShouldPersistTaps="always">
        <InputRow>
          <NameAndIconInput
            name={state.name}
            onNameChange={setName}
            icon={state.icon}
            onIconChange={setIcon}
            productDef={state.selectedProductDef}
          />
        </InputRow>

        <InputRow>
          <UnitAndMassInput
            unitValue={state.unitValue}
            onUnitValueChange={setUnitValue}
            unit={state.unit}
            onUnitSelected={setUnit}
            massValue={state.massValue}
            onMassValueChange={setMassValue}
          />
        </InputRow>

        <InputRow>
          <InputRowWithLabel label={t("actionDateLabel")}>
            <ActionDatePicker date={state.actionDate} onSelected={setActionDate} />
          </InputRowWithLabel>
          <InputRowWithLabel label={t("expirationDateLabel")}>
            <ExpirationDatePicker date={state.expirationDate} onSelected={setExpirationDate}/>
          </InputRowWithLabel>
        </InputRow>

        <InputRow>
          <InputRowWithLabel label={t("categoryLabel")}>
            <ProductCategoryPicker
              selectedCategory={state.category}
              onCategorySelected={setCategory}
              enabled={!state.selectedProductDef}
            />
          </InputRowWithLabel>
        </InputRow>

        <InputRow>
          <InputRowWithLabel label={t("descriptionLabel")}>
            <RowTextInput
              value={state.description}
              placeholder={t("descriptionPlaceholder")}
              onChangeText={setDescription}
            />
          </InputRowWithLabel>
        </InputRow>
      </ScrollView>

      <BottomButton
        label={t("common:save")}
        onPress={onSavePress}
        isDisabled={!state.isValid}
        isLoading={isSaving}
        accessibilityLabel={"add-product-screen-save-button"}
      />

      <ProductSuggestionsList
        name={state.name}
        isVisible={state.isSuggestionsListVisible}
        positionTop={160}
        onProductSelected={setProductSuggestion}
        productSuggestions={productSuggestions}
      />

    </Container>
  );
}
