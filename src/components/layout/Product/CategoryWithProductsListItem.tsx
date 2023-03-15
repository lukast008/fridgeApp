import React, {useState} from 'react'
import {StyleSheet, View, TouchableHighlight} from 'react-native'
import {T1} from '../Text/Text'
import {ProductCategoryGroupDto} from "../../../dto/Product/ProductCategoryDto";
import COLORS from "../../../../assets/colors";
import ProductGroupDto from "../../../dto/Product/ProductGroupDto";
import {Icon} from "react-native-elements";

type Props = {
  category: ProductCategoryGroupDto;
  renderGroupedProducts: (productGroups: ProductGroupDto[]) => void;
}

export default function CategoryWithProductsListItem(props: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const toggleCategory = () => setIsVisible(!isVisible);
  const iconName = isVisible ? "keyboard-arrow-down" : "keyboard-arrow-right";
  return (
    <View key={props.category.name} style={styles.categoryContainer}>
      <TouchableHighlight style={styles.row} underlayColor={'none'} onPress={toggleCategory}>
        <>
          <Icon name={iconName} color={COLORS.textLight} size={30} />
          <T1 style={styles.categoryName}>{props.category.name}</T1>
        </>
      </TouchableHighlight>
      {isVisible && props.renderGroupedProducts(props.category.productGroups)}
    </View>
  )
}

const styles = StyleSheet.create({
  categoryContainer: {
    borderRadius: 10,
  },
  categoryName: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    color: COLORS.background,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.disabled,
    paddingLeft: 10,
  }
})
