import React, {useEffect, useRef, useState} from 'react'
import {StyleSheet, View, TouchableOpacity, FlatList, TextInput} from 'react-native'
import Modal from 'react-native-modal';
import COLORS from '../../../../assets/colors';
import { T2, T3 } from '../Text/Text';
import {Icon} from "react-native-elements";
import ProductCategoryDto from "../../../dto/Product/ProductCategoryDto";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import {useData} from "../../../providers/DataProvider";

type Props = {
  selectedCategory?: ProductCategoryDto,
  onCategorySelected: (category?: ProductCategoryDto) => void;
  enabled?: boolean;
}

export default function ProductCategoryPicker(props: Props) {

  const [isListVisible, setIsListVisible] = useState(false);
  const { productCategoriesProvider } = useData();

  const { productCategories, fetchNoCategory } = productCategoriesProvider;
  const [noCategoryObject, setNoCategoryObject] = useState<ProductCategoryDto>();

  const { t } = useDefaultTranslation('addProduct');

  const nameInputRef = useRef<TextInput | null>(null);
  const [name, setName] = useState('');

  useEffect(() => setNoCategoryObject(fetchNoCategory()), []);

  function toggleList() {
    setIsListVisible(!isListVisible);
  }

  function handleCategoryPress(category?: ProductCategoryDto) {
    setIsListVisible(false);
    props.onCategorySelected(category);
  }

  function renderList() {
    return(
      <Modal
        isVisible={isListVisible}
        onBackdropPress={toggleList}
        onBackButtonPress={toggleList}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}>
        <View style={styles.modalStyle}>
          <View style={styles.header}>
            <T2 style={{color: COLORS.background}}>Wybierz kategorię</T2>
          </View>
          <TextInput
            ref={nameInputRef}
            style={styles.nameInput}
            value={name}
            placeholder={t("namePlaceholder")}
            onChangeText={setName}
            removeClippedSubviews={false}
          />
          <View style={styles.separator} />
          <FlatList
            data={productCategories.filter(item => !item.isDefault && item.name.toLowerCase().includes(name.toLowerCase()))}
            keyExtractor={(item) => item.name}
            numColumns={1}
            renderItem={({item}) => renderCategoryOnList(item)}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            ListHeaderComponent={renderHeader}
          />
          <View style={styles.separator} />
          {renderFooter()}
        </View>
      </Modal>
    );
  }

  function renderCategoryOnList(category: ProductCategoryDto) {
    const backgroundColor = category.name === props.selectedCategory?.name ? COLORS.lightGray : COLORS.background;
    return (
      <TouchableOpacity onPress={() => handleCategoryPress(category)}>
        <View style={[styles.item, {backgroundColor: backgroundColor}]}>
          <T2>{category.name}</T2>
        </View>
      </TouchableOpacity>
    );
  }

  function renderHeader() {
    if(!name) return <></>;
    if(productCategories.filter(item => item.name.toLowerCase() === name.toLowerCase()).length > 0) return <></>;
    return renderCategoryOnList(new ProductCategoryDto(name));
  }

  function renderFooter() {
    if(!noCategoryObject) return;
    const backgroundColor = !props.selectedCategory || props.selectedCategory._id.equals(noCategoryObject._id)
      ? COLORS.lightGray
      : COLORS.background;
    return (
      <TouchableOpacity onPress={() => handleCategoryPress(noCategoryObject)}>
        <View style={[styles.item, {backgroundColor: backgroundColor}]}>
          <T2 style={styles.itemTextNoCategory}>{noCategoryObject?.name}</T2>
        </View>
      </TouchableOpacity>
    );
  }

  const categoryName = props.selectedCategory?.name || noCategoryObject?.name;
  if(props.enabled) {
    return (
      <View>
        <TouchableOpacity style={styles.row} onPress={toggleList} hitSlop={{top: 5, bottom: 10, left: 20, right: 20}}>
          <T3 style={{fontSize: 17}}>{categoryName}</T3>
          <Icon name={"expand-more"} color={COLORS.textDark} size={18} />
        </TouchableOpacity>
        {isListVisible && renderList()}
      </View>
    )
  } else {
    return (
      <View>
        <View style={styles.row}>
          <T3 style={{fontSize: 17}}>{categoryName}</T3>
        </View>
        {isListVisible && renderList()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modalStyle: {
    height: "80%",
    borderRadius: 10,
    backgroundColor: COLORS.background,
    width: "80%",
    alignSelf: "center"
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },
  itemTextNoCategory: {
    fontStyle: "italic",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameInput: {
    borderColor: COLORS.lightGray,
    fontSize: 16,
    lineHeight: 16,
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  separator: {
    height: 2,
    width: "100%",
    backgroundColor: COLORS.primary,
  }
})
