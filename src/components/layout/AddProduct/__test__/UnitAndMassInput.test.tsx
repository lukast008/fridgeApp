import * as React from 'react'
import {fireEvent, render} from '@testing-library/react-native';
import UnitAndMassInput from "../UnitAndMassInput";
import {unitService} from "../../../../service/UnitService";

jest.mock('react-native-localize', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  findBestAvailableLanguage: jest.fn(),
}));

let onUnitValueChange: jest.Mock;
let onMassValueChange: jest.Mock;

const renderComponent = (unitValue: number, massValue: number) => {
  onUnitValueChange = jest.fn();
  onMassValueChange = jest.fn();
  return render(
    <UnitAndMassInput
      unitValue={unitValue}
      onUnitValueChange={onUnitValueChange}
      unit={unitService.getDefaultUnit()}
      onUnitSelected={jest.fn()}
      massValue={massValue}
      onMassValueChange={onMassValueChange} />
  );
}

describe("UnitAndMassInput component", () => {
  it('given an input with unit value 2 and mass value 100, user should see sum value 200g', () => {
    const { getByLabelText } = renderComponent(2, 100);
    const sumInput = getByLabelText("mass-value-sum-input");
    const sumLabelShort = getByLabelText("mass-value-sum-input-label-short");
    expect(sumInput.props["value"]).toBe("200");
    expect(sumLabelShort.props["children"]).toBe("G");
  });

  it('given an input with unit value 2 and mass value 600, user should see sum value 1.2kg', () => {
    const { getByLabelText } = renderComponent(2, 600);
    const sumInput = getByLabelText("mass-value-sum-input");
    const sumLabelShort = getByLabelText("mass-value-sum-input-label-short");
    expect(sumInput.props["value"]).toBe("1.20");
    expect(sumLabelShort.props["children"]).toBe("KG");
  });
});

describe("UnitAndMassInput component -> change unit value", () => {
  it('given an input with unit value 2 and mass value 100, after unit value change to 3 user should see sum value 300g', () => {
    const { getByLabelText } = renderComponent(2, 100);

    const unitInput = getByLabelText("unit-value-input");
    fireEvent.changeText(unitInput, "3");

    const sumInput = getByLabelText("mass-value-sum-input");
    const sumLabelShort = getByLabelText("mass-value-sum-input-label-short");
    expect(sumInput.props["value"]).toBe("300");
    expect(sumLabelShort.props["children"]).toBe("G");
  });
});

describe("UnitAndMassInput component -> change mass value", () => {
  it('given an input with unit value 2 and mass value 100, after mass value change to 200 user should see sum value 400g', () => {
    const { getByLabelText } = renderComponent(2, 100);

    const massInput = getByLabelText("mass-value-input");
    fireEvent.changeText(massInput, "200");
    fireEvent(massInput, 'onEndEditing');

    const sumInput = getByLabelText("mass-value-sum-input");
    const sumLabelShort = getByLabelText("mass-value-sum-input-label-short");
    expect(sumInput.props["value"]).toBe("400");
    expect(sumLabelShort.props["children"]).toBe("G");
  });
});

describe("UnitAndMassInput component -> change sum mass value", () => {
  it('given an input with unit value 2 and mass value 100, after sum mass value change to 600 user should see mass value 300g', () => {
    const { getByLabelText } = renderComponent(2, 100);

    const sumInput = getByLabelText("mass-value-sum-input");
    fireEvent.changeText(sumInput, "600");
    fireEvent(sumInput, 'onEndEditing');

    const massInput = getByLabelText("mass-value-input");
    const massLabelShort = getByLabelText("mass-value-input-label-short");
    expect(massInput.props["value"]).toBe("300");
    expect(massLabelShort.props["children"]).toBe("G");
  });

  it('given an input with unit value 2 and mass value 100, after sum mass value change to 2400 user should see mass value 1.2kg', () => {
    const { getByLabelText } = renderComponent(2, 100);

    const sumInput = getByLabelText("mass-value-sum-input");
    fireEvent.changeText(sumInput, "2400");
    fireEvent(sumInput, 'onEndEditing');

    const massInput = getByLabelText("mass-value-input");
    const massLabelShort = getByLabelText("mass-value-input-label-short");
    expect(massInput.props["value"]).toBe("1.20");
    expect(massLabelShort.props["children"]).toBe("KG");
  });
});
