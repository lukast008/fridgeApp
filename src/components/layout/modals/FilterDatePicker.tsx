import React, {useEffect} from 'react'
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native'
import Modal from 'react-native-modal';
import COLORS from '../../../../assets/colors';
import {T1, T2, T4} from "../Text/Text";
import {dateFilterService} from "../../../service/DateFilterService";
import DateFilterDto from "../../../dto/DateFilterDto";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import {Icon} from "react-native-elements";

type Props = {
  isVisible: boolean;
  date?: Date;
  onSelected: (id: string) => void;
  onClosed: () => void;
}

export default function FilterDatePicker(props: Props) {

  const { t } = useDefaultTranslation("dates");

  const dateOptions: DateFilterDto[] = [
    dateFilterService.prepareDayFilterData(new Date()),
    dateFilterService.prepareWeekFilterData(new Date()),
    dateFilterService.prepareMonthFilterData(new Date()),
    dateFilterService.prepareYearFilterData(new Date()),
  ]

  function handleOptionPress(dateOption: DateFilterDto) {
    props.onSelected(dateOption.id);
  }

  function renderOption(dateOption: DateFilterDto) {
    return (
      <TouchableOpacity onPress={() => handleOptionPress(dateOption)}>
        <View style={styles.optionContainer}>
          <T2 style={{textAlign: "center"}}>{dateOption.name}</T2>
          <T4 style={{color: COLORS.border, fontStyle: "italic", textAlign: "center"}}>{dateOption.value}</T4>
        </View>
      </TouchableOpacity>
    );
  }

  function renderOptionAll() {
    const dateOption = dateFilterService.prepareAllFilterData(new Date());
    return (
      <TouchableOpacity onPress={() => handleOptionPress(dateOption)}>
        <View style={[styles.optionContainer, {width: 288}]}>
          <T2 style={{textAlign: "center"}}>{dateOption.name}</T2>
          <Icon name="all-inclusive" color={COLORS.primary} size={35} />
        </View>
      </TouchableOpacity>
    );
  }

  return(
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={props.onClosed}
      onBackButtonPress={props.onClosed}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
    >
      <View style={styles.modalStyle}>
        <View style={styles.title}>
          <T1 style={{color: COLORS.textLight}}>{t("filterRange")}:</T1>
        </View>
        <FlatList
            data={dateOptions}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({item}) => renderOption(item)}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
        />
        {renderOptionAll()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalStyle: {
    borderRadius: 10,
    padding: 2,
    backgroundColor: COLORS.primary,
    width: 300,
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  optionContainer: {
    width: 142,
    height: 80,
    margin: 2,
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
})
