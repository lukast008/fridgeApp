import {Card, Icon} from "react-native-elements";
import {StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {T1} from "../Text/Text";
import COLORS from "../../../../assets/colors";
import React, {useEffect, useRef, useState} from "react";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import ProductCategoryDto from "../../../dto/Product/ProductCategoryDto";

type Props = {
  item: ProductCategoryDto;
  isEditMode: boolean;
  onEditPress: (item: ProductCategoryDto) => void;
  onDeletePress: (item: ProductCategoryDto) => void
  onSavePress: (name: string) => void;
  onCancelPress: () => void;
  isCategoryValid: (name: string) => boolean;
}

const ProductCategoriesListItem = (props: Props) => {
  const { item, isEditMode, onEditPress, onDeletePress, onSavePress, onCancelPress } = props;
  const { t } = useDefaultTranslation('addProduct');

  const nameInputRef = useRef<TextInput | null>(null);
  const [name, setName] = useState(props.item.name);

  useEffect(() => {
    if(isEditMode) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);
    } else {
      setName(props.item.name);
    }
  }, [isEditMode]);

  const handleSavePressed = () => onSavePress(name);

  const renderButtons = () => {
    if(isEditMode) {
      const isValid = props.isCategoryValid(name);
      return (
        <>
          <Icon reverse name={"done"} color={COLORS.green} size={14} onPress={handleSavePressed} disabled={!isValid} />
          <Icon reverse name={"clear"} color={COLORS.invalid} size={14} onPress={onCancelPress} />
        </>
      )
    } else {
      return (
        <>
          <Icon reverse name={"edit"} color={COLORS.primary} size={14} onPress={() => onEditPress(item)} />
          {!item.isDefault && <Icon reverse name={"delete"} color={COLORS.invalid} size={14} onPress={() => onDeletePress(item)} />}
        </>
      )
    }
  }

  const renderCategoryName = () => {
    if(isEditMode) {
      return (
        <TextInput
          ref={nameInputRef}
          style={styles.nameInput}
          value={name}
          placeholder={t("namePlaceholder")}
          onChangeText={setName}
          removeClippedSubviews={false}
        />
      )
    } else {
      return <T1 style={styles.name}>{item.name}</T1>;
    }
  }

  const borderColor = isEditMode ? COLORS.primary : COLORS.background;
  return (
    <Card containerStyle={[styles.card, {borderColor: borderColor}]}>
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <View style={styles.columnLeft}>
            {renderCategoryName()}
          </View>
          <View style={styles.columnRight}>
            {renderButtons()}
          </View>
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  columnLeft: {
    flex: 1,
    justifyContent: "center",
  },
  columnRight: {
    justifyContent: "center",
    flexDirection: "row"
  },
  name: {
    lineHeight: 20,
    fontSize: 20,
    minHeight: 36,
    textAlignVertical: "center",
    paddingVertical: 0,
    paddingHorizontal: 5,
    fontWeight: "bold",
    color: COLORS.textTitle
  },
  nameInput: {
    backgroundColor: COLORS.lightGray,
    width: "100%",
    fontSize: 20,
    lineHeight: 20,
    borderRadius: 5,
    height: 36,
    paddingVertical: 0,
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  }
});

export default ProductCategoriesListItem;
