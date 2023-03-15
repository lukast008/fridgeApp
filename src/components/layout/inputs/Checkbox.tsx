import React, {useState} from 'react'
import {T2} from "../Text/Text";
import COLORS from "../../../../assets/colors";
import styled from "styled-components/native";
import {Switch} from "react-native";

const Container = styled.View`
  padding: 5px;
  margin: 5px;
  flex-direction: row;
  justify-content: space-between;
`;

type Props = {
  label: string;
  initialValue: boolean;
  onValueChanged: (newValue: boolean) => void;
}

export default function Checkbox(props: Props) {
  const [value, setValue] = useState(props.initialValue);
  return (
    <Container>
      <T2>{props.label}</T2>
      <Switch
        trackColor={{ false: COLORS.lightGray, true: COLORS.primaryTransparent }}
        thumbColor={value ? COLORS.primary : COLORS.lightGray}
        onValueChange={(newValue) => {
          props.onValueChanged(newValue);
          setValue(newValue);
        }}
        value={value}
      />
    </Container>
  );
}
