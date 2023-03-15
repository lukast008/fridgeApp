import React, {useState} from 'react'
import {StyleSheet, View} from 'react-native'
import { Icon } from 'react-native-elements'
import COLORS from '../../../../assets/colors'
import ProductDto from '../../../dto/Product/ProductDto'
import {unitService} from '../../../service/UnitService'
import TextNumberUtils from '../../../utils/TextNumberUtils'
import {productService} from '../../../service/ProductService';
import DateUtils from '../../../utils/DateUtils'
import { T1, T2 } from '../Text/Text';
import UnitValueInput from '../inputs/UnitValueInput';
import ExpirationDatePicker from "../modals/ExpirationDatePicker";
import ActivityTypeDto from "../../../dto/ActivityTypeDto";
import {ProductActions} from "../../../data/productActionsData";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import ActionDatePicker from "../modals/ActionDatePicker";

type Props = {
  product: ProductDto;
  actionType: string;
  onBackPress: () => void;
  onSavePress: (unitValue: number, expirationDate: Date, actionDate: Date) => void;
}

export default function OptionsForm(props: Props) {

  const { t } = useDefaultTranslation("dates");

  const actionDto: ActivityTypeDto = productService.getProductAction(props.actionType);

  const [unitValue, setUnitValue] = useState(getDefaultUnitValue(props.product.unitValue));
  const [actionDate, setActionDate] = useState(new Date());
  const [expirationDate, setExpirationDate] = useState(DateUtils.addDaysToDate(new Date(), 3));
  const [isActionDateCalendarVisible, setIsActionDateCalendarVisible] = useState(false);
  const [isExpirationDateCalendarVisible, setIsExpirationDateCalendarVisible] = useState(false);

  function getDefaultUnitValue(unitValue: number) {
    return Math.min(unitValue, 1);
  }

  function onUnitValueChange(value: number) {
    setUnitValue(value)
  }

  function saveForm() {
    props.onSavePress(unitValue, expirationDate, actionDate);
  }

  function toggleActionDateCalendar() {
    setIsActionDateCalendarVisible(!isActionDateCalendarVisible);
  }

  function toggleExpirationDateCalendar() {
    setIsExpirationDateCalendarVisible(!isExpirationDateCalendarVisible);
  }

  function handleActionDateChange(selectedDate: Date) {
    setIsActionDateCalendarVisible(false);
    setActionDate(selectedDate);
  }

  function handleExpirationDateChange(selectedDate?: Date) {
    setExpirationDate(selectedDate || DateUtils.getInfinitDate());
    setIsExpirationDateCalendarVisible(false);
  }

  function renderExpirationDate() {
    if(actionDto.isExpirationDateRequired) {
      return (
        <ExpirationDatePicker
          date={expirationDate}
          onSelected={handleExpirationDateChange}
          customDateFormat={t("expirationDate") + ": " + DateUtils.convertDateToString(expirationDate)}
        />
      );
    }
  }

  function renderActionDate() {
    return (
      <ActionDatePicker
        date={actionDate}
        onSelected={handleActionDateChange}
        customDateFormat={actionDto.actionDateLabel + ": " + DateUtils.convertDateToString(actionDate)}
      />
    );
  }

  function render() {
    const { product, actionType, onBackPress } = props;
    const unitValueNumber = TextNumberUtils.roundNumber(unitValue);
    const unitName = unitService.getUnitNameForNumber(product.definition.unitName, unitValueNumber);
    const maxUnitValue = actionType === ProductActions.ADD ? undefined : product.unitValue;
    const isValid = unitService.isUnitValueValid(unitValueNumber, maxUnitValue);

    return (
      <View>
        <View style={styles.header}>
          <Icon name='arrow-back' color={COLORS.primary} size={35} onPress={onBackPress}/>
          <T1 style={styles.textHeader}>{actionDto.label}</T1>
        </View>
        <View style={styles.inputContainer}>
          <View style={{flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "center"}}>
            <UnitValueInput
              unitValue={unitValue}
              maxUnitValue={maxUnitValue}
              onUnitValueChange={onUnitValueChange}
            />
            <T2>  {unitName}</T2>
          </View>
          <Icon
            name='send'
            style={styles.saveButton}
            color={isValid ? COLORS.primary : COLORS.disabled}
            size={35}
            onPress={saveForm}
          />
        </View>
        {renderExpirationDate()}
        {renderActionDate()}
      </View>
    )
  }

  return render();
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  unitValueInput: {
    backgroundColor: COLORS.background,
    width: 50,
    fontSize: 18,
    borderRadius: 10,
    borderBottomWidth: 2,
    borderColor: COLORS.primary,
    padding: 5,
    paddingBottom: 0,
    textAlign: "center",
  },
  dateRowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  saveButton: {
    alignSelf: "flex-end",
    flex: 2,
    marginLeft: 10,
  },
  textHeader: {
    marginLeft: 5,
  },
})
