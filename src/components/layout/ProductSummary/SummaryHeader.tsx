import React from "react";
import IconService from "../../../service/IconService";
import {unitService} from "../../../service/UnitService";
import {Image, StyleSheet, View} from "react-native";
import {H2} from "../Text/Header";
import {T1} from "../Text/Text";
import ProductDto from "../../../dto/Product/ProductDto";
import COLORS from "../../../../assets/colors";

type Props = {
  products: ProductDto[];
}

export default function SummaryHeader(props: Props) {

  const iconPath = IconService.getIconByName(props.products[0].definition.iconName)?.iconPath;
  let sum = 0;
  props.products.forEach(item => sum += item.unitValue);
  const unitName = unitService.getUnitNameForNumber(props.products[0].definition.unitName, sum);

  return (
    <View style={styles.header}>
      <Image source={iconPath} style={{width: 45, height: 45}} />
      <H2 style={styles.title}>{props.products[0].definition.name}</H2>
      <T1> {sum} {unitName}</T1>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginHorizontal: 10,
    marginVertical: 5,
    flexWrap: "wrap",
  },
  title: {
    marginHorizontal: 10,
    color: COLORS.textTitle,
    flex: 1,
  },
});
