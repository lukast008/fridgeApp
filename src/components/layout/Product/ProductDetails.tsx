import React from 'react'
import { StyleSheet, View, TouchableOpacity} from 'react-native'
import ProductDto from '../../../dto/Product/ProductDto'
import DateUtils from '../../../utils/DateUtils'
import TextNumberUtils from '../../../utils/TextNumberUtils'
import {unitService} from '../../../service/UnitService'
import { T3 } from '../Text/Text'

type Props = {
  productDetails: ProductDto;
  unitName: string;
  onProductOptionsPress: (product: ProductDto) => void;
}

export default function ProductDetails(props: Props) {
  const { productDetails, unitName, onProductOptionsPress } = props;
  const unitValue = TextNumberUtils.convertNumberToString(productDetails.unitValue);
  const unit = unitService.getUnitNameForNumber(unitName, productDetails.unitValue);
  const description = productDetails.description ? "(" + productDetails.description + ")" : "";
  return (
    <TouchableOpacity onPress={() => onProductOptionsPress(productDetails)}>
      <View style={styles.container}>
        <View style={styles.unitContainer}>
          <T3 style={{marginRight: 5}}>{unitValue} {unit}</T3>
          {description !== "" && <T3 style={styles.descriptionText}>{description}</T3> }
        </View>
        <View style={styles.expirationDateContainer}>
          <T3 style={[styles.expirationDateText, {color: DateUtils.getExpirationDateColor(productDetails.expirationDate)}]}>
            {DateUtils.convertDateToRelativeTime(productDetails.expirationDate)}
          </T3>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  expirationDateContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  expirationDateText: {
    alignItems: "flex-end",
  },
  unitContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  descriptionText: {
    fontStyle: "italic",
    flexWrap: "wrap",
  }
})
