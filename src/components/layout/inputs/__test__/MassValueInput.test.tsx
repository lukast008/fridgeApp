import * as React from 'react'
import {fireEvent, render} from '@testing-library/react-native';
import MassValueInput from "../MassValueInput";
import {MassUnits} from "../../../../data/unitsData";

jest.mock('react-native-localize', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  findBestAvailableLanguage: jest.fn(),
}));

let onUnitValueChange: jest.Mock;
beforeEach(() => {
  onUnitValueChange = jest.fn();
})

describe("MassValueInput component", () => {
  it('given an input with value 1200g, user should see 1.2kg', () => {
    const { getByLabelText } = render(<MassValueInput onUnitValueChange={onUnitValueChange} unitValue={1200} unitLabel={MassUnits.KILOGRAM} />);
    const input = getByLabelText("mass-value-input");
    const labelShort = getByLabelText("mass-value-input-label-short");
    expect(input.props["value"]).toBe("1.20");
    expect(labelShort.props["children"]).toBe("KG");
  });

  it('given an input with value 1200ml, user should see 1.2l', () => {
    const { getByLabelText } = render(<MassValueInput onUnitValueChange={onUnitValueChange} unitValue={1200} unitLabel={MassUnits.LITER} />);
    const input = getByLabelText("mass-value-input");
    const labelShort = getByLabelText("mass-value-input-label-short");
    expect(input.props["value"]).toBe("1.20");
    expect(labelShort.props["children"]).toBe("L");
  });

  it('entering value 1200, user should see 1.2kg', () => {
    const { getByLabelText } = render(<MassValueInput onUnitValueChange={onUnitValueChange} unitValue={100} unitLabel={MassUnits.KILOGRAM} />);
    const input = getByLabelText("mass-value-input");
    const labelShort = getByLabelText("mass-value-input-label-short");
    fireEvent.changeText(input, "1200");
    fireEvent(input, 'onEndEditing');
    expect(input.props["value"]).toBe("1.20");
    expect(labelShort.props["children"]).toBe("KG");
  });

  it('entering value 1.2, user should see 1.2kg', () => {
    const { getByLabelText } = render(<MassValueInput onUnitValueChange={onUnitValueChange} unitValue={100} unitLabel={MassUnits.KILOGRAM} />);
    const input = getByLabelText("mass-value-input");
    const labelShort = getByLabelText("mass-value-input-label-short");
    fireEvent.changeText(input, "1.2");
    fireEvent(input, 'onEndEditing');
    expect(input.props["value"]).toBe("1.20");
    expect(labelShort.props["children"]).toBe("KG");
  });

  it('entering value 1,2, user should see 1.2kg', () => {
    const { getByLabelText } = render(<MassValueInput onUnitValueChange={onUnitValueChange} unitValue={100} unitLabel={MassUnits.KILOGRAM} />);
    const input = getByLabelText("mass-value-input");
    const labelShort = getByLabelText("mass-value-input-label-short");
    fireEvent.changeText(input, "1,2");
    fireEvent(input, 'onEndEditing');
    expect(input.props["value"]).toBe("1.20");
    expect(labelShort.props["children"]).toBe("KG");
  });

  it('entering value 120, user should see 120g', () => {
    const { getByLabelText } = render(<MassValueInput onUnitValueChange={onUnitValueChange} unitValue={100} unitLabel={MassUnits.KILOGRAM} />);
    const input = getByLabelText("mass-value-input");
    const labelShort = getByLabelText("mass-value-input-label-short");
    fireEvent.changeText(input, "120");
    fireEvent(input, 'onEndEditing');
    expect(input.props["value"]).toBe("120");
    expect(labelShort.props["children"]).toBe("G");
  });
});

describe("MassValueInput component > plus button", () => {
  it('given an input with value 1200g, pressing + button should result with 1.3kg value', () => {
    const { getByLabelText } = render(<MassValueInput onUnitValueChange={onUnitValueChange} unitValue={1200} unitLabel={MassUnits.KILOGRAM} />);
    const plusButton = getByLabelText("mass-value-input-plus-btn");
    fireEvent.press(plusButton);
    const input = getByLabelText("mass-value-input");
    expect(onUnitValueChange).toBeCalledWith(1300);
    expect(onUnitValueChange).toBeCalledTimes(1);
    expect(input.props["value"]).toBe("1.30");
  });

  it('given an input with value 100g, pressing + button should result with 200g value', () => {
    const { getByLabelText } = render(<MassValueInput onUnitValueChange={onUnitValueChange} unitValue={100} unitLabel={MassUnits.KILOGRAM} />);
    const plusButton = getByLabelText("mass-value-input-plus-btn");
    fireEvent.press(plusButton);
    const input = getByLabelText("mass-value-input");
    expect(onUnitValueChange).toBeCalledWith(200);
    expect(onUnitValueChange).toBeCalledTimes(1);
    expect(input.props["value"]).toBe("200");
  });

  it('given an input with value 50g, pressing + button should result with 60g value', () => {
    const { getByLabelText } = render(<MassValueInput onUnitValueChange={onUnitValueChange} unitValue={50} unitLabel={MassUnits.KILOGRAM} />);
    const plusButton = getByLabelText("mass-value-input-plus-btn");
    fireEvent.press(plusButton);
    const input = getByLabelText("mass-value-input");
    expect(onUnitValueChange).toBeCalledWith(60);
    expect(onUnitValueChange).toBeCalledTimes(1);
    expect(input.props["value"]).toBe("60");
  });
});

describe("MassValueInput component > minus button", () => {
  it('given an input with value 1200g, pressing - button should result with 1.1kg value', () => {
    const { getByLabelText } = render(<MassValueInput onUnitValueChange={onUnitValueChange} unitValue={1200} unitLabel={MassUnits.KILOGRAM} />);
    const minusButton = getByLabelText("mass-value-input-minus-btn");
    fireEvent.press(minusButton);
    const input = getByLabelText("mass-value-input");
    expect(onUnitValueChange).toBeCalledWith(1100);
    expect(onUnitValueChange).toBeCalledTimes(1);
    expect(input.props["value"]).toBe("1.10");
  });

  it('given an input with value 100g, pressing - button should result with 90g value', () => {
    const { getByLabelText } = render(<MassValueInput onUnitValueChange={onUnitValueChange} unitValue={100} unitLabel={MassUnits.KILOGRAM} />);
    const minusButton = getByLabelText("mass-value-input-minus-btn");
    fireEvent.press(minusButton);
    const input = getByLabelText("mass-value-input");
    expect(onUnitValueChange).toBeCalledWith(90);
    expect(onUnitValueChange).toBeCalledTimes(1);
    expect(input.props["value"]).toBe("90");
  });

  it('given an input with value 200g, pressing - button should result with 100g value', () => {
    const { getByLabelText } = render(<MassValueInput onUnitValueChange={onUnitValueChange} unitValue={200} unitLabel={MassUnits.KILOGRAM} />);
    const minusButton = getByLabelText("mass-value-input-minus-btn");
    fireEvent.press(minusButton);
    const input = getByLabelText("mass-value-input");
    expect(onUnitValueChange).toBeCalledWith(100);
    expect(onUnitValueChange).toBeCalledTimes(1);
    expect(input.props["value"]).toBe("100");
  });

  it('given an input with value 0, pressing - button should result with 0 value', () => {
    const { getByLabelText } = render(<MassValueInput onUnitValueChange={onUnitValueChange} unitValue={0} unitLabel={MassUnits.KILOGRAM} />);
    const minusButton = getByLabelText("mass-value-input-minus-btn");
    fireEvent.press(minusButton);
    const input = getByLabelText("mass-value-input");
    expect(onUnitValueChange).toBeCalledTimes(0);
    expect(input.props["value"]).toBe("0");
  });
});
