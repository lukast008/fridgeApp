import React, {useRef, useState} from 'react';
import styled from "styled-components/native";
import COLORS from "../../../../assets/colors";
import {Icon} from "react-native-elements";
import {T3} from "../Text/Text";
import {Row, TitleInput} from "./common";
import {TextInput} from "react-native";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";

const AddButtonRow = styled(Row)`
  padding-left: 45px;
  height: 40px;
`;

const AddButtonLabel = styled(T3)`
  margin-left: 10px;
  color: ${COLORS.textTitle};
`;

const TitleNewInput = styled(TitleInput)<{isVisible: boolean}>`
  display: ${props => props.isVisible ? 'flex' : 'none'};
  margin-left: 35px;
`;

interface Props {
  onEndEditing: (title: string) => void;
}

const ShoppingListNewItem = (props: Props) => {

  const [title, setTitle] = useState('');
  const inputRef = useRef<TextInput | null>(null);
  const [hasFocus, setHasFocus] = useState(false);
  const { t } = useDefaultTranslation("shoppingList");

  const handleEndEditing = () => {
    if(title) {
      props.onEndEditing(title);
      setTitle('');
    }
  }

  const handleAddButtonPress = () => {
    handleEndEditing();
    setHasFocus(true);
    setTimeout(() => inputRef.current && inputRef.current?.focus(), 50);
  }

  return (
    <>
      <Row accessibilityLabel={`shopping-list-item-${title}`}>
        <TitleNewInput
          ref={inputRef}
          isVisible={hasFocus}
          value={title}
          placeholder={t("enterNamePlaceholder")}
          blurOnSubmit={false}
          onChangeText={setTitle}
          onEndEditing={handleEndEditing}
          onSubmitEditing={handleEndEditing}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
        />
      </Row>
      {(!!title || !hasFocus) &&
        <AddButtonRow onPress={handleAddButtonPress} accessibilityLabel={'shopping-list-add-button'}>
          <Icon name={'add'} color={COLORS.textTitle} size={25} />
          <AddButtonLabel>{t("addProductLabel")}</AddButtonLabel>
        </AddButtonRow>
      }
    </>
  );
};

export default ShoppingListNewItem;

