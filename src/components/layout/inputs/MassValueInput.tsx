import React, {useEffect, useMemo, useState} from 'react'
import { Icon } from 'react-native-elements'
import COLORS from '../../../../assets/colors'
import TextNumberUtils from '../../../utils/TextNumberUtils'
import {T3} from "../Text/Text";
import {MassUnits} from "../../../data/unitsData";
import {NumericInput, NumericInputContainer} from './common'

type Props = {
  unitValue: number;
  onUnitValueChange: (value: number) => void;
  unitLabel: string;
  hideButtons?: boolean;
  fontSize?: number;
  accessibilityLabel?: string;
}

MassValueInput.defaultProps = {
  accessibilityLabel: "mass-value-input",
  fontSize: 18,
}

export default function MassValueInput(props:Props) {
  const [value, setValue] = useState(props.unitValue);
  const [valueStr, setValueStr] = useState("");

  const unitShort = useMemo(() => {
      if(props.unitLabel === MassUnits.KILOGRAM) {
        return value < 1000 ? "G" : "KG";
      } else if(props.unitLabel === MassUnits.LITER) {
        return value < 1000 ? "ML" : "L";
      }
    }, [props.unitLabel, value]
  );

  useEffect(() => {
    setValueStr(TextNumberUtils.convertNumberToString(value < 1000 ? value : value/1000));
    if(props.unitValue !== value) props.onUnitValueChange(value);
  }, [value]);

  useEffect(() => {
    setValue(props.unitValue);
  }, [props.unitValue]);

  const handleTextInputEndEditing = (newValue?: string) => {
    const val = newValue || valueStr;
    const valueNumber = TextNumberUtils.convertStringToNumber(val);
    setValue(valueNumber > 10 && Number.isInteger(valueNumber) ? valueNumber : valueNumber * 1000);
  }

  const handleTextChange = (newValue: string) => {
    const formattedValue = TextNumberUtils.parseStringAsNumber(newValue);
    setValueStr(formattedValue);
    handleTextInputEndEditing(formattedValue);
  }

  const onMinusButtonPress = () => {
    const incrValue = value <= 100 ? 10 : 100;
    let newUnitValue = value - incrValue;
    if(newUnitValue < 0) newUnitValue = 0;
    setValue(newUnitValue);
  }

  const onPlusButtonPress = () => {
    const incrValue = value > 0 && value < 100 ? 10 : 100;
    const newUnitValue = value + incrValue;
    setValue(newUnitValue);
  }

  const minusButtonColor = value <= 0.0001 ? COLORS.disabled : COLORS.primary;
  const plusButtonColor = COLORS.primary;
  return (
    <NumericInputContainer>
      {!props.hideButtons &&
        <Icon name='remove' color={minusButtonColor} size={30} onPress={onMinusButtonPress}
            accessibilityLabel={props.accessibilityLabel + "-minus-btn"}/>
      }
      <NumericInput
        accessibilityLabel={props.accessibilityLabel}
        keyboardType="numeric"
        fontSize={props.fontSize}
        value={valueStr}
        onChangeText={handleTextChange}
        onEndEditing={() => handleTextInputEndEditing()}
        maxLength={5}
      />
      <T3 style={{fontSize: props.fontSize}} accessibilityLabel={props.accessibilityLabel + "-label-short"}>{unitShort}</T3>
      {!props.hideButtons &&
        <Icon name='add' color={plusButtonColor} size={30} onPress={onPlusButtonPress}
            accessibilityLabel={props.accessibilityLabel + "-plus-btn"}/>
      }
    </NumericInputContainer>
  )
}
