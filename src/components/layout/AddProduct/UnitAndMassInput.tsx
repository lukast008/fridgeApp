import React, {useEffect, useMemo, useState} from 'react'
import InputRowWithLabel from "../inputs/InputRowWithLabel";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import {InputRow} from '../inputs/common';
import {T4} from "../Text/Text";
import styled from "styled-components/native";
import UnitValueInput from "../inputs/UnitValueInput";
import UnitPicker from "../modals/UnitPicker";
import UnitDto from "../../../dto/UnitDto";
import MassValueInput from "../inputs/MassValueInput";
import {MassUnits} from "../../../data/unitsData";
import {Row} from "../common/Containers";
import {Icon} from "react-native-elements";
import COLORS from "../../../../assets/colors";

const InputContainer = styled.View`
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

interface Props {
  unitValue: number;
  onUnitValueChange: (newUnitValue: number) => void;
  unit: UnitDto;
  onUnitSelected: (newUnit: string) => void;
  massValue: number;
  onMassValueChange: (newMassValue: number) => void;
}

export default function UnitAndMassInput(props: Props) {
  const { t } = useDefaultTranslation('addProduct');

  const [unitValue, setUnitValue] = useState(props.unitValue);
  const [massValue, setMassValue] = useState(props.massValue);
  const [isMassValueEditable, setIsMassValueEditable] = useState(props.massValue && props.massValue !== 0);

  const sumMassValue = useMemo(() => unitValue * massValue, [unitValue, massValue]);
  const massUnitLabel = props.unit.massUnit === MassUnits.KILOGRAM ? t("unit:weight") : t("unit:volume");

  useEffect(() => setUnitValue(props.unitValue), [props.unitValue]);
  useEffect(() => setMassValue(props.massValue), [props.massValue]);

  const handleUnitValueChanged = (newUnitValue: number) => {
    setUnitValue(newUnitValue);
    props.onUnitValueChange(newUnitValue);
  }

  const handleMassValueChanged = (newMassValue: number) => {
    setMassValue(newMassValue);
    props.onMassValueChange(newMassValue);
  }

  return (
    <>
      <InputRowWithLabel label={t("unitLabel")}>
        <InputContainer>
          <UnitValueInput unitValue={unitValue} onUnitValueChange={handleUnitValueChanged} />
          <UnitPicker
            selectedUnit={props.unit}
            unitValue={unitValue}
            onUnitSelected={props.onUnitSelected}
            enabled={true}
          />
        </InputContainer>
      </InputRowWithLabel>
      <InputRowWithLabel label={massUnitLabel}>
        <InputContainer>
        {!isMassValueEditable && massValue === 0
          ? <Icon name='edit' color={COLORS.primary} size={25} onPress={() => setIsMassValueEditable(true)} />
          : (
            <>
              <MassValueInput unitValue={massValue} onUnitValueChange={handleMassValueChanged} unitLabel={props.unit.massUnit} fontSize={18} />
              <Row>
                <T4>{t("unit:sum")}: </T4>
                <MassValueInput
                  unitValue={sumMassValue}
                  fontSize={16}
                  onUnitValueChange={value => handleMassValueChanged(value / unitValue)}
                  unitLabel={props.unit.massUnit}
                  hideButtons={true}
                  accessibilityLabel={"mass-value-sum-input"}
                />
              </Row>
            </>
          )
        }
        </InputContainer>
      </InputRowWithLabel>
    </>
  );
}
