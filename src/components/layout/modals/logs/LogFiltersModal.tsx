import React, {useMemo, useState} from 'react'
import styled from "styled-components/native";
import LogFilterDto from "../../../../dto/AppInfo/LogFilterDto";
import Checkbox from "../../inputs/Checkbox";
import {useDefaultTranslation} from "../../../../utils/TranslationsUtils";
import ButtonWithLabel from "../../inputs/ButtonWithLabel";
import DateTimeInput from "../../inputs/DateTimeInput";
import {T2} from "../../Text/Text";
import {Icon} from "react-native-elements";
import COLORS from "../../../../../assets/colors";
import {TouchableOpacity} from "react-native";

const Container = styled.View`
  padding: 10px;
  width: 100%;
`;

const DatesContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const SortingContainer = styled(TouchableOpacity)`
  flex-direction: row;
  margin: 5px;
`;

type Props = {
  logFilter: LogFilterDto;
  onChanged: (logFilter: LogFilterDto) => void;
}

export default function LogFiltersModal(props: Props) {

  const { t } = useDefaultTranslation('logs');
  const [onlyCurrentSession, setOnlyCurrentSession] = useState(props.logFilter.onlyCurrentSession);
  const [startDate, setStartDate] = useState(props.logFilter.startDate);
  const [endDate, setEndDate] = useState(props.logFilter.endDate);
  const [sortingOrder, setSortingOrder] = useState(props.logFilter.sortingOrder);

  const onConfirmPress = () => {
    const logFilter = new LogFilterDto(onlyCurrentSession, startDate, endDate, sortingOrder);
    props.onChanged(logFilter);
  }

  const toggleSorting = () => {
    if(sortingOrder === 'DESC') setSortingOrder('ASC');
    else setSortingOrder('DESC');
  }

  const sortingIconName = useMemo(
    () => sortingOrder === 'DESC' ? 'keyboard-arrow-down' : 'keyboard-arrow-up',
    [sortingOrder]);

  return (
    <Container>
      <SortingContainer onPress={toggleSorting}>
        <T2>{t("filter.sorting")}</T2>
        <Icon name={sortingIconName} color={COLORS.primary} size={30}/>
      </SortingContainer>

      <DatesContainer>
        <DateTimeInput value={startDate} onValueChanged={setStartDate} />
        <T2>-</T2>
        <DateTimeInput value={endDate} onValueChanged={setEndDate} />
      </DatesContainer>

      <Checkbox
        label={t("filter.only-current-session-label")}
        initialValue={onlyCurrentSession}
        onValueChanged={setOnlyCurrentSession}
      />

      <ButtonWithLabel label={'OK'} onPress={onConfirmPress} />
    </Container>
  );
}
