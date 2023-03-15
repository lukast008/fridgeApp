import styled from "styled-components/native";
import {TouchableOpacity} from "react-native";

export const Row = styled(TouchableOpacity)`
  flex-direction: row;
  padding: 1px 15px 1px 20px;
  align-items: center;
`;

export const TitleInput = styled.TextInput`
  margin-left: 10px;
  padding: 0;
  font-size: 16px;
  flex: 1;
  height: 40px;
`;
