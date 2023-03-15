import * as React from 'react'
import {fireEvent, render} from '@testing-library/react-native';
import UnitValueInput from "../UnitValueInput";

jest.mock('react-native-localize', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  findBestAvailableLanguage: jest.fn(),
}));

let onUnitValueChange: jest.Mock;
beforeEach(() => {
  onUnitValueChange = jest.fn();
})

describe("UnitValueInput component", () => {
  it('entering valid value, onUnitValueChange should be called', () => {
    const { getByLabelText } = render(<UnitValueInput onUnitValueChange={onUnitValueChange} unitValue={1}/>);
    const input = getByLabelText("unit-value-input");
    fireEvent.changeText(input, "12");
    expect(onUnitValueChange).toBeCalledTimes(1);
    expect(onUnitValueChange).toBeCalledWith(12);
  });

  it('entering the same value to input, onUnitValueChange should not be called', () => {
    const { getByLabelText } = render(<UnitValueInput onUnitValueChange={onUnitValueChange} unitValue={1}/>);
    const input = getByLabelText("unit-value-input");
    fireEvent.changeText(input, "1");
    expect(onUnitValueChange).toBeCalledTimes(0);
  });
});

describe("UnitValueInput component > plus button", () => {
  it('given an input with value 2, pressing + button should result with value 3', () => {
    const { getByLabelText } = render(<UnitValueInput onUnitValueChange={onUnitValueChange} unitValue={2}/>);
    const plusButton = getByLabelText("unit-value-input-plus-btn");
    fireEvent.press(plusButton);
    const input = getByLabelText("unit-value-input");
    expect(onUnitValueChange).toBeCalledWith(3);
    expect(onUnitValueChange).toBeCalledTimes(1);
    expect(input.props["value"]).toBe("3");
  });

  it('given an input with value 1, pressing + button should result with value 2', () => {
    const { getByLabelText } = render(<UnitValueInput onUnitValueChange={onUnitValueChange} unitValue={1}/>);
    const plusButton = getByLabelText("unit-value-input-plus-btn");
    fireEvent.press(plusButton);
    const input = getByLabelText("unit-value-input");
    expect(onUnitValueChange).toBeCalledWith(2);
    expect(onUnitValueChange).toBeCalledTimes(1);
    expect(input.props["value"]).toBe("2");
  });

  it('given an input with value 0.4, pressing + button should result with value 0.5', () => {
    const { getByLabelText } = render(<UnitValueInput onUnitValueChange={onUnitValueChange} unitValue={0.4}/>);
    const plusButton = getByLabelText("unit-value-input-plus-btn");
    fireEvent.press(plusButton);
    const input = getByLabelText("unit-value-input");
    expect(onUnitValueChange).toBeCalledWith(0.5);
    expect(onUnitValueChange).toBeCalledTimes(1);
    expect(input.props["value"]).toBe("0.50");
  });
});

describe("UnitValueInput component > minus button", () => {
  it('given an input with value 2, pressing - button should result with value 1', () => {
    const { getByLabelText } = render(<UnitValueInput onUnitValueChange={onUnitValueChange} unitValue={2}/>);
    const plusButton = getByLabelText("unit-value-input-minus-btn");
    fireEvent.press(plusButton);
    const input = getByLabelText("unit-value-input");
    expect(onUnitValueChange).toBeCalledWith(1);
    expect(onUnitValueChange).toBeCalledTimes(1);
    expect(input.props["value"]).toBe("1");
  });

  it('given an input with value 1, pressing - button should result with value 0.9', () => {
    const { getByLabelText } = render(<UnitValueInput onUnitValueChange={onUnitValueChange} unitValue={1}/>);
    const plusButton = getByLabelText("unit-value-input-minus-btn");
    fireEvent.press(plusButton);
    const input = getByLabelText("unit-value-input");
    expect(onUnitValueChange).toBeCalledWith(0.9);
    expect(onUnitValueChange).toBeCalledTimes(1);
    expect(input.props["value"]).toBe("0.90");
  });

  it('given an input with value 0.4, pressing - button should result with value 0.3', () => {
    const { getByLabelText } = render(<UnitValueInput onUnitValueChange={onUnitValueChange} unitValue={0.4}/>);
    const plusButton = getByLabelText("unit-value-input-minus-btn");
    fireEvent.press(plusButton);
    const input = getByLabelText("unit-value-input");
    expect(onUnitValueChange).toBeCalledWith(0.3);
    expect(onUnitValueChange).toBeCalledTimes(1);
    expect(input.props["value"]).toBe("0.30");
  });

  it('given an input with value 0, pressing - button should result with value 0', () => {
    const { getByLabelText } = render(<UnitValueInput onUnitValueChange={onUnitValueChange} unitValue={0}/>);
    const plusButton = getByLabelText("unit-value-input-minus-btn");
    fireEvent.press(plusButton);
    const input = getByLabelText("unit-value-input");
    expect(onUnitValueChange).toBeCalledTimes(0);
    expect(input.props["value"]).toBe("0");
  });
});

describe("UnitValueInput component > total button", () => {
  it('given an input without max unit, total button should not be visible', () => {
    const { queryByLabelText } = render(<UnitValueInput onUnitValueChange={onUnitValueChange} unitValue={2}/>);
    const totalButton = queryByLabelText("unit-value-input-total-btn");
    expect(totalButton).toBe(null);
  });

  it('given an input with max unit 5, pressing total button should result with value 5', () => {
    const { getByLabelText } = render(<UnitValueInput onUnitValueChange={onUnitValueChange} unitValue={2} maxUnitValue={5}/>);
    const totalButton = getByLabelText("unit-value-input-total-btn");
    fireEvent.press(totalButton);
    const input = getByLabelText("unit-value-input");
    expect(onUnitValueChange).toBeCalledWith(5);
    expect(onUnitValueChange).toBeCalledTimes(1);
    expect(input.props["value"]).toBe("5");
  });
});
