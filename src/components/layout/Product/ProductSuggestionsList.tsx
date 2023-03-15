import React, {useEffect, useState} from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import {T2, T4} from "../Text/Text";
import ProductSuggestionDto from "../../../dto/Product/ProductSuggestionDto";
import IconService from "../../../service/IconService";
import COLORS from "../../../../assets/colors";
import {unitService} from "../../../service/UnitService";

type Props = {
  name: string;
  isVisible: boolean;
  positionTop: number;
  onProductSelected: (product?: ProductSuggestionDto) => void;
  productSuggestions: ProductSuggestionDto[];
}

export default function ProductSuggestionsList(props: Props) {

  const {productSuggestions} = props;
  const [filteredProducts, setFilteredProducts] = useState<ProductSuggestionDto[]>([]);

  useEffect(() => {
    if(productSuggestions && props.name) {
      setFilteredProducts(productSuggestions.filter(item => item.productDef.name.toLowerCase().includes(props.name.toLowerCase())).slice(0, 8));
    } else {
      setFilteredProducts([]);
    }
  }, [props.name]);

  const handleProductSelected = (productSuggestion?: ProductSuggestionDto) => {
    Keyboard.dismiss();
    props.onProductSelected(productSuggestion);
  }

  function renderItem(item: ProductSuggestionDto) {
    const iconPath = IconService.getIconByName(item.productDef.iconName)?.iconPath;
    const unitName = unitService.getUnitByName(item.productDef.unitName).nameIf1;
    return (
      <TouchableOpacity onPress={() => handleProductSelected(item)}>
        <View style={styles.itemExternalContainer}>
          <View style={styles.itemContainer}>
            <View style={styles.columnLeft}>
              <Image source={iconPath} style={{width: 40, height: 40}} />
            </View>
            <View style={styles.columnRight}>
              <T2>{item.productDef.name}</T2>
              <T4>{unitName}</T4>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if(props.isVisible && filteredProducts.length > 0) {
    return (
      <TouchableWithoutFeedback onPress={() => handleProductSelected(undefined)}>
        <View style={[styles.container, {top: props.positionTop}]}>
          <FlatList
            data={productSuggestions.filter(item => item.productDef.name.toLowerCase().includes(props.name.toLowerCase())).slice(0, 8)}
            renderItem={item => renderItem(item.item)}
            keyExtractor={item => item.productDef.name + item.productDef.unitName}
            numColumns={2}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </TouchableWithoutFeedback>
    )
  } else {
    return <></>;
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    elevation: 10,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.backgroundTransparent,
  },
  itemExternalContainer: {
    width: Dimensions.get("screen").width/2 - 9,
    marginLeft: 6,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 5,
    backgroundColor: COLORS.background,
  },
  columnLeft: {
    flex: 1,
    justifyContent: "center",
  },
  columnRight: {
    marginLeft: 10,
    flex: 4,
  }
})
