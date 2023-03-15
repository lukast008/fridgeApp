import ProductDefDto, {cloneProductDefDto} from "../../../dto/Product/ProductDefDto";
import IconService from "../../../service/IconService";
import {unitService} from "../../../service/UnitService";
import {Card, Icon} from "react-native-elements";
import {StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {T1} from "../Text/Text";
import COLORS from "../../../../assets/colors";
import React, {useEffect, useRef, useState} from "react";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import IconPicker from "../modals/IconPicker";
import UnitPicker from "../modals/UnitPicker";
import ProductCategoryPicker from "../modals/ProductCategoryPicker";

type Props = {
  item: ProductDefDto;
  isEditMode: boolean;
  onProductPress?: (item: ProductDefDto) => void;
  onEditPress?: (item: ProductDefDto) => void;
  onProductChanged?: (productDefDto: ProductDefDto) => void;
}

const ProductDefListItem = (props: Props) => {
  const { item, isEditMode, onProductPress, onEditPress } = props;
  const { t } = useDefaultTranslation('addProduct');

  const nameInputRef = useRef<TextInput | null>(null);
  const [name, setName] = useState(props.item.name);
  const [icon, setIcon] = useState(IconService.getIconByName(props.item.iconName));
  const [unitName, setUnitName] = useState(props.item.unitName);
  const [category, setCategory] = useState(props.item.category);

  useEffect(() => {
    if(isEditMode) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);
    } else {
      setName(props.item.name);
      setIcon(IconService.getIconByName(props.item.iconName));
      setUnitName(props.item.unitName);
      setCategory(props.item.category);
    }
  }, [isEditMode]);

  useEffect(() => {
    setIcon(IconService.getIconByName(props.item.iconName));
  }, [props.item.iconName]);

  useEffect(() => {
    setCategory(props.item.category);
  }, [props.item.category?.name]);

  useEffect(() => {
    const productDefDto = cloneProductDefDto(props.item);
    productDefDto.name = name;
    productDefDto.iconName = icon.name;
    productDefDto.unitName = unitName;
    productDefDto.category = category;
    if(props.onProductChanged) props.onProductChanged(productDefDto);
  }, [name, icon, unitName, category]);

  const renderButtons = () => {
    if(!isEditMode) {
      return (
        <Icon reverse name={"edit"} color={COLORS.primary} size={14} onPress={() => onEditPress && onEditPress(item)} />
      );
    }
  }

  const renderProductName = () => {
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

  const borderColor = isEditMode ? COLORS.background : COLORS.background;
  return (
    <Card containerStyle={[styles.card, {borderColor: borderColor}]}>
      <TouchableOpacity onPress={() => onProductPress && onProductPress(item)}>
        <View style={styles.itemContainer}>
          <View style={styles.columnLeft}>
            <View style={styles.row}>
              <IconPicker selectedIcon={icon} onIconSelected={setIcon} enabled={isEditMode} />
              <View style={styles.columnMiddle}>
                {renderProductName()}
              </View>
            </View>
            <View style={styles.row}>
              <View style={{padding: 5, flex: 4}}>
                <UnitPicker
                  selectedUnit={unitService.getUnitByName(unitName)}
                  unitValue={1}
                  onUnitSelected={setUnitName}
                  enabled={isEditMode}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={{padding: 5, flex: 4}}>
                <ProductCategoryPicker
                  selectedCategory={category}
                  onCategorySelected={setCategory}
                  enabled={isEditMode}
                />
              </View>
            </View>
          </View>
          {!isEditMode && onEditPress &&
            <View style={styles.columnRight}>
              <Icon reverse name={"edit"} color={COLORS.primary} size={14} onPress={() => onEditPress(item)} />
            </View>
          }

        </View>
      </TouchableOpacity>
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
  columnMiddle: {
    marginLeft: 10,
    flex: 1,
  },
  columnRight: {
    //flex: 2,
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
  unitName: {
    fontSize: 17,
    padding: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  }
});

export default ProductDefListItem;
