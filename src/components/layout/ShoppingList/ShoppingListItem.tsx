import React, {useEffect, useRef, useState} from 'react';
import ShoppingListItemDto from "../../../dto/ShoppingListItemDto";
import COLORS from "../../../../assets/colors";
import {Icon} from "react-native-elements";
import { Row, TitleInput } from './common';
import {Animated, TextInput} from "react-native";
import {Screens} from "../../../navigation/Screens";
import {useNavigation} from "@react-navigation/native";

interface Props {
  item: ShoppingListItemDto;
  onEndEditing: (title: string, item: ShoppingListItemDto) => void;
  onDelete: (item: ShoppingListItemDto) => void;
  onCheckPressed: (isChecked: boolean, item: ShoppingListItemDto) => void;
}

const ShoppingListItem = (props: Props) => {

  const [title, setTitle] = useState(props.item ? props.item.title : '');
  const [isSelected, setIsSelected] = useState(!!props.item.purchaseDate);
  const inputRef = useRef<TextInput | null>(null);
  const [hasFocus, setHasFocus] = useState(false);
  const navigation = useNavigation();

  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => setTitle(props.item.title), [props.item.title]);

  const handleEndEditing = () => {
    if(!title) props.onDelete(props.item);
    else if(props.item.title !== title) props.onEndEditing(title, props.item);
  }

  const handleOnDelete = () => {
    props.onDelete(props.item);
  }

  const handleCheckPressed = () => {
    setIsSelected(!isSelected);
    Animated.timing(anim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
      props.onCheckPressed(!isSelected, props.item);
    });
  }

  const handleAddToFridge = () => {
    navigation.navigate(Screens.ADD_PRODUCT_SCREEN, {
      "name": props.item.title,
      "origin": Screens.SHOPPING_LIST_SCREEN
    });
  }

  const iconName = isSelected ? 'check-circle' : 'radio-button-unchecked';
  return (
    <Animated.View style={{opacity: anim}}>
      <Row accessibilityLabel={`shopping-list-item_${isSelected ? 'bought' : 'toBuy'}_${title}`}>
        <Icon name={iconName} color={COLORS.primary} size={25} onPress={handleCheckPressed} accessibilityLabel={'check-button'} />
        <TitleInput
          ref={inputRef}
          value={title}
          blurOnSubmit={false}
          onChangeText={setTitle}
          onEndEditing={handleEndEditing}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          accessibilityLabel={`shopping-list-item-input_${title}`}
        />
        {hasFocus &&
          <Icon
            name={'clear'}
            color={COLORS.textTitle}
            size={25}
            accessibilityLabel={'clear-button'}
            onPress={handleOnDelete}
          />
        }
        {!hasFocus && isSelected &&
          <Icon
            name={'kitchen'}
            color={COLORS.textTitle}
            size={25}
            accessibilityLabel={'fridge-button'}
            onPress={handleAddToFridge}
          />
        }
      </Row>
    </Animated.View>
  );
};

export default ShoppingListItem;

