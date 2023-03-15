import React, {useEffect, useRef} from 'react'
import InputRowWithLabel from "../inputs/InputRowWithLabel";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import {RowTextInput} from '../inputs/common';
import styled from "styled-components/native";
import {TextInput} from "react-native";
import IconPicker from "../modals/IconPicker";
import ProductDefDto from "../../../dto/Product/ProductDefDto";
import IconDto from "../../../dto/IconDto";

const NameInputContainer = styled.View`
  flex: 4;
  align-items: center;
  justify-content: center;
`;

const IconInputContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

interface Props {
  name: string;
  onNameChange: (newName: string) => void;
  icon: IconDto;
  onIconChange: (newIcon: IconDto) => void;
  productDef?: ProductDefDto;
}

export default function NameAndIconInput(props: Props) {
  const { t } = useDefaultTranslation('addProduct');

  const nameInputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    setTimeout(() => nameInputRef.current?.focus(), 50);
  }, []);

  return (
    <InputRowWithLabel label={t("nameLabel")}>
      <NameInputContainer>
        <RowTextInput
          ref={nameInputRef}
          accessibilityLabel={"add-product-screen-name-input"}
          value={props.name}
          placeholder={t("namePlaceholder")}
          onChangeText={props.onNameChange}
          onTouchStart={() => props.onNameChange(props.name)}
        />
      </NameInputContainer>
      <IconInputContainer>
        <IconPicker selectedIcon={props.icon} onIconSelected={props.onIconChange} enabled={!props.productDef} />
      </IconInputContainer>
    </InputRowWithLabel>
  );
}
