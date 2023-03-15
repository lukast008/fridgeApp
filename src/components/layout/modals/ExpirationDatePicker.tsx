import React, {useState} from 'react'
import { TouchableOpacity, FlatList } from 'react-native'
import COLORS from '../../../../assets/colors';
import {T2, T3, T4} from "../Text/Text";
import DateUtils from "../../../utils/DateUtils";
import {Icon} from "react-native-elements";
import DateTimePicker from '@react-native-community/datetimepicker';
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import styled from "styled-components/native";
import GenericModal from "./GenericModal";

const Container = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const DateLabel = styled(T3)`
  margin-left: 10px;
  flex: 1;
`;

const OptionContainer = styled.View`
  width: 142px;
  height: 142px;
  margin: 2px;
  border-radius: 10px;
  background-color: ${COLORS.background};
  align-items: center;
  justify-content: center;
`;

const OptionTitle = styled(T2)`
  text-align: center;
`;

const OptionDescription = styled(T4)`
  color: ${COLORS.border};
  font-style: italic;
`;

type Props = {
  date?: Date;
  onSelected: (date?: Date) => void;
  customDateFormat?: string;
}

interface DateOption {
  title: string;
  date?: Date;
  icon?: string;
  isDateSelector?: boolean;
}

export default function ExpirationDatePicker(props: Props) {

  const { t } = useDefaultTranslation("dates");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const dateOptions: DateOption[] = [
    {
      title: t("3days"),
      date: DateUtils.addDaysToDate(new Date(), 3),
    },
    {
      title: t("week"),
      date: DateUtils.addDaysToDate(new Date(), 7),
    },
    {
      title: t("noExpirationDate"),
      icon: "all-inclusive",
    },
    {
      title: t("selectDate"),
      icon: "today",
      isDateSelector: true,
    },
  ]

  const handleOptionPress = (dateOption: DateOption) => {
    dateOption.isDateSelector ? setIsCalendarVisible(true) : handleDateSelected(dateOption.date);
  }

  const handleDateSelected = (selectedDate?: Date) => {
    setIsModalVisible(false);
    props.onSelected(selectedDate);
  }

  const setDateFromCalendar = (event: Event, selectedDate?: Date) => {
    setIsCalendarVisible(false);
    handleDateSelected(selectedDate);
  }

  function renderOption(dateOption: DateOption) {
    return (
      <TouchableOpacity onPress={() => handleOptionPress(dateOption)}>
        <OptionContainer>
          <OptionTitle>{dateOption.title}</OptionTitle>
          {!!dateOption.date && <OptionDescription>{DateUtils.convertDateToString(dateOption.date)}</OptionDescription>}
          {!!dateOption.icon && <Icon name={dateOption.icon} color={COLORS.primary} size={35} />}
        </OptionContainer>
      </TouchableOpacity>
    );
  }

  return(
    <Container onPress={() => setIsModalVisible(true)}>
      <Icon name='today' color={COLORS.primary} size={30} />
      <DateLabel>{props.customDateFormat || DateUtils.convertDateToValueAndRelative(props.date, t("dates:noExpirationDate"))}</DateLabel>
      <GenericModal isVisible={isModalVisible} title={t("validTo") + ":"} onBackdropPress={() => setIsModalVisible(false)}>
        <FlatList
          data={dateOptions}
          keyExtractor={(item) => item.title}
          numColumns={2}
          renderItem={({item}) => renderOption(item)}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
        />
      </GenericModal>
      {isCalendarVisible && <DateTimePicker value={props.date || new Date()} onChange={setDateFromCalendar}/>}
    </Container>
  );
}
