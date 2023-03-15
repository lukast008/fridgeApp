import React from 'react';
import {View, FlatList, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import ProductDto from '../../../dto/Product/ProductDto';
import {T2, T3} from "../Text/Text";
import {Card, Icon} from "react-native-elements";
import {unitService} from "../../../service/UnitService";
import DateUtils from "../../../utils/DateUtils";
import COLORS from "../../../../assets/colors";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";

type Props = {
  products: ProductDto[];
  onProductPress: (product: ProductDto) => void;
  highlightedProduct?: ProductDto;
  onProductHighlighted: (product: ProductDto) => void;
}

export default function SummaryProductsList(props: Props) {

  const { t } = useDefaultTranslation('dates');

  function renderItem(product: ProductDto) {
    const unitName = unitService.getUnitNameForNumber(product.definition.unitName, product.unitValue);
    const dateColor = DateUtils.getExpirationDateColor(product.expirationDate);
    const backgroundColor = props.highlightedProduct && props.highlightedProduct._id === product._id
      ? COLORS.disabled
      : COLORS.background;
    return (
      <TouchableWithoutFeedback onPress={() => props.onProductHighlighted(product)}>
      <Card containerStyle={[styles.card, {backgroundColor: backgroundColor}]}>
        <View style={styles.row}>
          <View style={{flex: 1}}>
            <View style={styles.row}>
              <T2 style={[styles.unit]}>{product.unitValue} {unitName}</T2>
              {product.description !== "" &&
              <T3 style={styles.description}>({product.description})</T3>
              }
            </View>
            <T3>{t("added")} {DateUtils.convertDateToValueAndRelative(product.creationDate)}</T3>
            {product.openingDate && <T3>{t("opened")} {DateUtils.convertDateToValueAndRelative(product.openingDate)}</T3>}
            <T3 style={{color: dateColor}}>{t("validTo")}  {DateUtils.convertDateToValueAndRelative(product.expirationDate)}</T3>
          </View>
          <Icon name='more-vert' color={COLORS.primary} size={30} iconStyle={styles.optionsIcon} onPress={() => props.onProductPress(product)}/>
        </View>
      </Card>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={props.products}
        renderItem={({item}) => renderItem(item)}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    //paddingBottom: 10,
  },
  card: {
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center"
  },
  description: {
    fontStyle: "italic",
    marginHorizontal: 5,
    flex: 1,
  },
  unit: {
    color: COLORS.textTitle,
    fontWeight: "bold",
  },
  optionsIcon: {
    flex: 1,
  }
});
