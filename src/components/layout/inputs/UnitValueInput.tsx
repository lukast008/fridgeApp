import React, {useEffect, useState} from 'react'
import { Icon } from 'react-native-elements'
import COLORS from '../../../../assets/colors'
import TextNumberUtils from '../../../utils/TextNumberUtils'
import {NumericInput, NumericInputContainer} from "./common";

type Props = {
  unitValue: number;
  maxUnitValue?: number;
  onUnitValueChange: (value: number) => void;
}

export default function UnitValueInput(props:Props) {

  const [value, setValue] = useState(props.unitValue);
  const [valueStr, setValueStr] = useState(TextNumberUtils.convertNumberToString(props.unitValue));

  const maxUnitValue = props.maxUnitValue || 9999;
  const decrValue = value <= 1 ? 0.1 : 1;
  const incrValue = value < 1 ? 0.1 : 1;

  const isMinValueReached = (value: number) =>  value <= 0.0001;
  const isMaxValueReached = (value: number) => maxUnitValue - value <= 0.0001;

  useEffect(() => {
    const newUnitValue = TextNumberUtils.convertStringToNumber(valueStr)
    setValue(newUnitValue);
    if(props.unitValue !== newUnitValue) props.onUnitValueChange(newUnitValue);
  }, [valueStr]);

  useEffect(() => setValueStr(TextNumberUtils.convertNumberToString(props.unitValue)), [props.unitValue]);

  const handleTextInputChange = (newValue: string) => {
    setValueStr(TextNumberUtils.parseStringAsNumber(newValue));
  }

  const onMinusButtonPress = () => {
    if(!isMinValueReached(value)) {
      let newUnitValue = value - decrValue;
      setValueStr(TextNumberUtils.convertNumberToString(newUnitValue));
    }
  }

  const onPlusButtonPress = () => {
    let newUnitValue = value + incrValue;
    if(isMaxValueReached(newUnitValue)) newUnitValue = maxUnitValue;
    setValueStr(TextNumberUtils.convertNumberToString(newUnitValue));
  }

  const onTotalButtonPress = () => {
    setValueStr(TextNumberUtils.convertNumberToString(maxUnitValue));
  }

  const minusButtonColor = isMinValueReached(value) ? COLORS.disabled : COLORS.primary;
  const plusButtonColor = isMaxValueReached(value) ? COLORS.disabled : COLORS.primary;
  const totalButtonColor = isMaxValueReached(value) ? COLORS.disabled : COLORS.primary;
  return (
    <NumericInputContainer>
      <Icon name='remove' color={minusButtonColor} size={30} onPress={onMinusButtonPress} accessibilityLabel={"unit-value-input-minus-btn"} />
      <NumericInput
        accessibilityLabel={"unit-value-input"}
        keyboardType="numeric"
        value={valueStr}
        onChangeText={handleTextInputChange}
        maxLength={5}
      />
      <Icon name='add' color={plusButtonColor} size={30} onPress={onPlusButtonPress} accessibilityLabel={"unit-value-input-plus-btn"}/>
      {props.maxUnitValue &&
        <Icon name='trending-up' color={totalButtonColor} size={30} onPress={onTotalButtonPress}
            accessibilityLabel={"unit-value-input-total-btn"}/>
      }
    </NumericInputContainer>
  )
}
