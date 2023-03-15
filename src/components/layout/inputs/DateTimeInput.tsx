import React, {useRef, useState} from 'react'
import {TouchableOpacity} from "react-native";
import {T3} from "../Text/Text";
import COLORS from "../../../../assets/colors";
import DateUtils from "../../../utils/DateUtils";
import styled from "styled-components/native";
import DateTimePicker from "@react-native-community/datetimepicker";

const Container = styled(TouchableOpacity)`
  border: 2px solid ${COLORS.primary};
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
  align-items: center;
  flex: 1;
`;

const DateValue = styled(T3)`
  text-align: center;
`;

type Props = {
  value: Date;
  onValueChanged: (newValue: Date) => void;
}

export default function DateTimeInput(props: Props) {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [mode, setMode] = useState<'time' | 'date'>('date');

  const date = useRef(props.value);
  const time = useRef(props.value);

  const onPress = () => {
    setIsCalendarVisible(true);
    setMode('date');
  }

  const setDateFromCalendar = (event: Event, selectedDate?: Date) => {
    if(mode === 'date' && selectedDate) {
      setMode('time');
      date.current = selectedDate;
    } else if(mode === 'time' && selectedDate) {
      setIsCalendarVisible(false);
      time.current = selectedDate;
      props.onValueChanged(formatDate(date.current, time.current));
    } else {
      setIsCalendarVisible(false);
    }
  }

  const formatDate = (date: Date, time: Date) => {
    let dateTime = new Date(date);
    dateTime.setHours(time.getHours());
    dateTime.setMinutes(time.getMinutes());
    return dateTime;
  };

  const dateTimeStr = DateUtils.convertDateToDateTimeInputString(props.value);
  return (
    <>
      <Container onPress={onPress}>
        <DateValue>{dateTimeStr}</DateValue>
      </Container>
      {isCalendarVisible &&
        <DateTimePicker
            value={props.value || new Date()}
            onChange={setDateFromCalendar}
            mode={mode}
            maximumDate={new Date()}/>
      }
    </>
  );
}
