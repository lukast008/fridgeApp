import styled from "styled-components/native";
import COLORS from "../../../../assets/colors";

export const InputRow = styled.View`
  flex-direction: row;
  margin: 10px 10px 0 10px;
`;

export const NumericInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const NumericInput = styled.TextInput<{fontSize?: number}>`
  background-color: ${COLORS.background};
  max-width: 100px;
  font-size: ${props => props.fontSize || 18}px;
  padding: 0 5px;
  text-align: center;
`;

export const RowTextInput = styled.TextInput`
  background-color: ${COLORS.background};
  width: 100%;
  font-size: 20px;
  padding: 10px;
`;
