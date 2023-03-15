import React from 'react'
import {StyleSheet, View, Image, FlatList, TouchableOpacity} from 'react-native'
import ProductDto from '../../../dto/Product/ProductDto'
import { Card} from 'react-native-elements';
import IconService from '../../../service/IconService';
import COLORS from '../../../../assets/colors';
import ProductGroupDto from '../../../dto/Product/ProductGroupDto';
import ProductDetails from './ProductDetails';
import { H2 } from '../Text/Header';
import ShoppingListIndicator from "../ShoppingList/ShoppingListIndicator";

type Props = {
  product: ProductGroupDto;
  showProductOptions: (product: ProductDto) => void;
  onProductSelected: (productDefId: ObjectId) => void;
}

export default function ProductCard(props: Props) {
  const { product, showProductOptions } = props;
  const iconPath = IconService.getIconByName(product.iconName)?.iconPath;
  return (
    <Card containerStyle={styles.card}>
      <TouchableOpacity onPress={() => props.onProductSelected(product._id)}>
        <View style={styles.container}>
          <View style={styles.columnLeft}>
            <Image source={iconPath} style={{width: 50, height: 50}} />
          </View>
          <View style={styles.columnRight}>
            <H2 style={styles.title}>{product.name}</H2>
            <FlatList
              data={product.items}
              renderItem={({item}) => (
                <ProductDetails productDetails={item} unitName={product.unitName} onProductOptionsPress={showProductOptions}/>
              )}
              keyExtractor={(item) => item._id}
              keyboardShouldPersistTaps="always"
            />
          </View>
        </View>
      </TouchableOpacity>
      <ShoppingListIndicator title={props.product.name} isOnList={!!props.product.isOnShoppingList} />
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  container: {
    flexDirection: "row",
  },
  title: {
    color: COLORS.textTitle,
  },
  columnLeft: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
  columnRight: {
    flex: 5,
    marginLeft: 10,
  }
})
