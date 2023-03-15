import React, {useState} from 'react'
import { TouchableOpacity } from 'react-native'
import COLORS from '../../../../assets/colors';
import {T3} from "../Text/Text";
import DateUtils from "../../../utils/DateUtils";
import {Icon} from "react-native-elements";
import DateTimePicker from '@react-native-community/datetimepicker';
import styled from "styled-components/native";

const Container = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
`;

const DateLabel = styled(T3)`
  margin-left: 10px;
  flex: 1;
`;

type Props = {
  date?: Date;
  onSelected: (date: Date) => void;
  customDateFormat?: string;
}

export default function ActionDatePicker(props: Props) {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const setDateFromCalendar = (event: Event, selectedDate?: Date) => {
    setIsCalendarVisible(false);
    selectedDate && props.onSelected(selectedDate);
  }

  return(
    <Container onPress={() => setIsCalendarVisible(true)}>
      <Icon name='today' color={COLORS.primary} size={30} />
      <DateLabel>{props.customDateFormat || DateUtils.convertDateToValueAndRelative(props.date)}</DateLabel>
      {isCalendarVisible && <DateTimePicker value={props.date || new Date()} onChange={setDateFromCalendar} maximumDate={new Date()}/>}
    </Container>
  );
}
