import React, {useMemo, useState} from 'react'
import COLORS from "../../../../assets/colors";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import styled from "styled-components/native";
import {Icon} from "react-native-elements";

const Container = styled.View`
  margin: 5px 15px;
  padding: 10px 15px;
  border-color: ${COLORS.primary};
  border-width: 2px;
  border-radius: 5px;
  flex-direction: row;
`;

const StyledInput = styled.TextInput`
  margin: 0;
  padding: 0;
  flex: 1;
`;

type Props = {
  value: string;
  onValueChanged: (text: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
}

export default function FormTextInput(props: Props) {
  const { t } = useDefaultTranslation('myProfile');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const placeholder = useMemo(() => {
    if(props.placeholder) return props.placeholder;
    if(!props.type) return '';
    switch (props.type) {
      case "text": return '';
      case "email": return t("email");
      case "password": return t("password");
    }
  }, [props.placeholder, props.type]);

  const togglePasswordVisible = () => setIsPasswordVisible(!isPasswordVisible);
  const showPasswordIconColor = useMemo(() => isPasswordVisible ? COLORS.disabled : COLORS.primary, [isPasswordVisible]);

  return (
    <Container>
      <StyledInput
        placeholder={placeholder}
        value={props.value}
        onChangeText={props.onValueChanged}
        autoCapitalize={"none"}
        autoCorrect={false}
        keyboardType={props.type === "email" ? "email-address" : "default"}
        secureTextEntry={props.type === 'password' && !isPasswordVisible}
      />
      { props.type === 'password' &&
        <Icon name='remove-red-eye' color={showPasswordIconColor} size={25} onPress={togglePasswordVisible} />
      }
    </Container>
  );
}
