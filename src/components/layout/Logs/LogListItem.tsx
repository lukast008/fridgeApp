import React from 'react'
import {TouchableOpacity} from 'react-native'
import LogDto from "../../../dto/AppInfo/LogDto";
import {T3, T4} from "../Text/Text";
import styled from "styled-components/native";
import DateUtils from "../../../utils/DateUtils";
import COLORS from "../../../../assets/colors";

const LogContainer = styled(TouchableOpacity)<{bgColor: string}>`
  border-color: ${props => props.bgColor};
  margin: 5px 10px 0 10px;
  border-radius: 5px;
  border-width: 2px;
`;

const LogDate = styled(T4)<{bgColor: string}>`
  background-color: ${props => props.bgColor};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  margin-top: -1px;
  color: ${COLORS.textLight};
`

const LogMsg = styled(T3)`
  color: ${COLORS.textDark};
  margin: 5px;
`

type Props = {
  item: LogDto;
  onLogItemPress: (item: LogDto) => void;
}

function LogListItem({item, onLogItemPress}: Props) {
  return (
    <LogContainer bgColor={item.color} onPress={() => onLogItemPress(item)}>
      <LogDate bgColor={item.color}>{DateUtils.convertDateToDateTimeString(item.timestamp)}</LogDate>
      <LogMsg numberOfLines={1}>[{item.level}] {item.message}</LogMsg>
    </LogContainer>
  );
}

const areEqual = (prevProps: Props, nextProps: Props) => {
  return prevProps.item._id.equals(nextProps.item._id);
};

export default React.memo(LogListItem, areEqual);
