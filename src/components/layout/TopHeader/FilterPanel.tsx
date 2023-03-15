import React, {useState} from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import { Icon } from 'react-native-elements'
import COLORS from '../../../../assets/colors'
import DateFilterDto from "../../../dto/DateFilterDto";
import {T1} from "../Text/Text";
import FilterDatePicker from "../modals/FilterDatePicker";
import {DateFilterTypes} from "../../../service/DateFilterService";

type Props = {
  onPressLeft?: () => void;
  onPressRight?: () => void;
  dateFilter?: DateFilterDto;
  onFilterChanged?: (id: string) => void;
}

export default function FilterPanel(props: Props) {

  const [isFilterPickerVisible, setIsFilterPickerVisible] = useState(false);

  const { onPressLeft, onPressRight, dateFilter } = props;
  const arrowRightColor = onPressRight ? COLORS.textLight : COLORS.primary;
  const arrowLeftColor = onPressLeft ? COLORS.textLight : COLORS.primary;

  function toggleFilterPicker() {
    setIsFilterPickerVisible(!isFilterPickerVisible);
  }

  function handleFilterChanged(id: string) {
    toggleFilterPicker();
    if(props.onFilterChanged) props.onFilterChanged(id);
  }

  function renderFilterPicker() {
    return(
      <FilterDatePicker
        isVisible={isFilterPickerVisible}
        date={new Date()}
        onSelected={handleFilterChanged}
        onClosed={toggleFilterPicker}
      />
    );
  }

  function renderFilterValue(dateFilter: DateFilterDto) {
    if(dateFilter.id === DateFilterTypes.ALL) {
      return (
        <Icon name="all-inclusive" color={COLORS.background} size={25} />
      );
    } else {
      return (
        <>
          <Icon name='event-note' color={COLORS.textLight} size={25}/>
          <T1 style={styles.title}>{dateFilter.value}</T1>
        </>
      )
    }
  }

  if(dateFilter) {
    return (
      <View style={styles.container}>
        <Icon name='keyboard-arrow-left' color={arrowLeftColor} size={35} iconStyle={styles.button} onPress={onPressLeft}/>
        <TouchableOpacity onPress={toggleFilterPicker}>
          <View style={styles.titleContainer}>
            {renderFilterValue(dateFilter)}
            <Icon name='expand-more' color={COLORS.textLight} size={25}/>
          </View>
        </TouchableOpacity>
        <Icon name='keyboard-arrow-right' color={arrowRightColor} size={35} iconStyle={styles.button} onPress={onPressRight}/>
        {isFilterPickerVisible && renderFilterPicker()}
      </View>
    )
  } else return <></>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  button: {
    marginLeft: 5,
    marginRight: 5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    marginLeft: 5,
    color: COLORS.textLight,
  }
});
