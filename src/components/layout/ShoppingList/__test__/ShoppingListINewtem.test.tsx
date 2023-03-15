import * as React from 'react'
import {fireEvent, render} from '@testing-library/react-native';
import ShoppingListNewItem from "../ShoppingListNewItem";

jest.mock('react-native-localize', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  findBestAvailableLanguage: jest.fn(),
}));

describe("ShoppingListNewItem component", () => {
  let onEndEditingMock: jest.Mock;

  beforeEach(() => {
    onEndEditingMock = jest.fn();
  })

  it('given an empty title with focus, user should see input and do not see add button', () => {
    const { getByPlaceholderText, queryByLabelText  } = render(<ShoppingListNewItem onEndEditing={onEndEditingMock} />);
    const input = getByPlaceholderText("Enter name");
    fireEvent(input, 'onFocus');
    const buttonRow = queryByLabelText("shopping-list-add-button");
    expect(buttonRow).toBe(null);
    expect(input.props["value"]).toBe("");
    expect(input.props["isVisible"]).toBe(true);
  });

  it('given an empty title without focus, user should see add button and do not see input', () => {
    const { getByPlaceholderText, queryByLabelText  } = render(<ShoppingListNewItem onEndEditing={onEndEditingMock} />);
    const input = getByPlaceholderText("Enter name");
    fireEvent(input, 'onBlur');
    const buttonRow = queryByLabelText("shopping-list-add-button");
    expect(buttonRow).not.toBe(null);
    expect(input.props["value"]).toBe("");
    expect(input.props["isVisible"]).toBe(false);
  });

  it('given a non empty title, user should see add button and input', () => {
    const { getByPlaceholderText, queryByLabelText  } = render(<ShoppingListNewItem onEndEditing={onEndEditingMock} />);
    const input = getByPlaceholderText("Enter name");
    fireEvent(input, 'onFocus');
    fireEvent.changeText(input, "new value");
    const buttonRow = queryByLabelText ("shopping-list-add-button");
    expect(buttonRow).not.toBe(null);
    expect(input.props["isVisible"]).toBe(true);
  });

  it('given an empty title, user can enter value', () => {
    const { getByPlaceholderText } = render(<ShoppingListNewItem onEndEditing={onEndEditingMock} />);
    const input = getByPlaceholderText("Enter name");
    fireEvent.changeText(input, "new value");
    expect(input.props["value"]).toBe("new value");
  });

  it('given a non empty title, onEndEditing function should be called after onSubmitEditing', () => {
    const { getByPlaceholderText } = render(<ShoppingListNewItem onEndEditing={onEndEditingMock} />);
    const input = getByPlaceholderText("Enter name");
    fireEvent.changeText(input, "new value");
    fireEvent(input, 'onSubmitEditing');
    expect(onEndEditingMock).toBeCalledTimes(1);
    expect(onEndEditingMock).toBeCalledWith("new value");
  });

  it('given an empty title, onEndEditing function should not be called after onSubmitEditing', () => {
    const { getByPlaceholderText } = render(<ShoppingListNewItem onEndEditing={onEndEditingMock} />);
    const input = getByPlaceholderText("Enter name");
    fireEvent(input, 'onSubmitEditing');
    expect(onEndEditingMock).not.toBeCalled();
  });

  it('given a non empty title, onEndEditing function should be called after onEndEditing', () => {
    const { getByPlaceholderText } = render(<ShoppingListNewItem onEndEditing={onEndEditingMock} />);
    const input = getByPlaceholderText("Enter name");
    fireEvent.changeText(input, "new value");
    fireEvent(input, 'onEndEditing');
    expect(onEndEditingMock).toBeCalledTimes(1);
    expect(onEndEditingMock).toBeCalledWith("new value");
  });

  it('given an empty title, onEndEditing function should not be called after onEndEditing', () => {
    const { getByPlaceholderText } = render(<ShoppingListNewItem onEndEditing={onEndEditingMock} />);
    const input = getByPlaceholderText("Enter name");
    fireEvent(input, 'onEndEditing');
    expect(onEndEditingMock).not.toBeCalled();
  });

  it('given a non empty title, title should be cleared after onEndEditing', () => {
    const { getByPlaceholderText } = render(<ShoppingListNewItem onEndEditing={onEndEditingMock} />);
    const input = getByPlaceholderText("Enter name");
    fireEvent.changeText(input, "new value");
    fireEvent(input, 'onEndEditing');
    expect(input.props["value"]).toBe("");
  });

  it('given a non empty title, title should be cleared after onSubmitEditing', () => {
    const { getByPlaceholderText } = render(<ShoppingListNewItem onEndEditing={onEndEditingMock} />);
    const input = getByPlaceholderText("Enter name");
    fireEvent.changeText(input, "new value");
    fireEvent(input, 'onSubmitEditing');
    expect(input.props["value"]).toBe("");
  });
});
