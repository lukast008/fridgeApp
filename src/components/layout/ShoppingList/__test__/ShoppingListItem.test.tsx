import * as React from 'react'
import {fireEvent, render, RenderAPI} from '@testing-library/react-native';
import ShoppingListItemDto from "../../../../dto/ShoppingListItemDto";
import ShoppingListItem from "../ShoppingListItem";
import {ReactTestInstance} from "react-test-renderer";
import {Screens} from "../../../../navigation/Screens";

jest.mock('react-native-localize', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  findBestAvailableLanguage: jest.fn(),
}));

const mockedNavigate = jest.fn();
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate
    }),
  };
});

const getIconName = (element: ReactTestInstance) => {
  return element.props.children[0].props.children.props["name"];
}

let onEndEditingMock: jest.Mock;
let onDeleteMock: jest.Mock;
let onCheckPressedMock: jest.Mock;
let itemToBuy: ShoppingListItemDto;
let itemBought: ShoppingListItemDto;
let renderedItemToBuy: RenderAPI;
let renderedItemBought: RenderAPI;

beforeEach(() => {
  onEndEditingMock = jest.fn();
  onDeleteMock = jest.fn();
  onCheckPressedMock = jest.fn();
  itemToBuy = new ShoppingListItemDto('test1');
  itemBought = new ShoppingListItemDto('test2');
  itemBought.purchaseDate = new Date();
  renderedItemToBuy = render(<ShoppingListItem item={itemToBuy} onEndEditing={onEndEditingMock} onDelete={onDeleteMock} onCheckPressed={onCheckPressedMock} />);
  renderedItemBought = render(<ShoppingListItem item={itemBought} onEndEditing={onEndEditingMock} onDelete={onDeleteMock} onCheckPressed={onCheckPressedMock} />);
})

describe("ShoppingListItem component -> input", () => {

  it('given non empty item, user can change it', () => {
    const { getByDisplayValue } = renderedItemToBuy;
    const input = getByDisplayValue("test1");
    fireEvent.changeText(input, "edited");
    expect(input.props["value"]).toBe("edited");
  });

  it('given non empty item, onEndEditing function should be called onEndEditing if edited', () => {
    const { getByDisplayValue } = renderedItemToBuy;
    const input = getByDisplayValue("test1");
    fireEvent.changeText(input, "new value");
    fireEvent(input, 'onEndEditing');
    expect(onEndEditingMock).toBeCalledTimes(1);
    expect(onEndEditingMock).toBeCalledWith("new value", itemToBuy);
  });

  it('given non empty item, onEndEditing function should not be called onEndEditing if not edited', () => {
    const { getByDisplayValue } = renderedItemToBuy;
    const input = getByDisplayValue("test1");
    fireEvent(input, 'onEndEditing');
    expect(onEndEditingMock).not.toBeCalled();
  });

  it('given non empty item, onEndEditing function should not be called if title is empty after onEndEditing event', () => {
    const { getByDisplayValue } = renderedItemToBuy;
    const input = getByDisplayValue("test1");
    fireEvent.changeText(input, "");
    fireEvent(input, 'onEndEditing');
    expect(onEndEditingMock).not.toBeCalled();
  });

  it('given non empty item, onDelete function should be called if title is empty after onEndEditing event', () => {
    const { getByDisplayValue } = renderedItemToBuy;
    const input = getByDisplayValue("test1");
    fireEvent.changeText(input, "");
    fireEvent(input, 'onEndEditing');
    expect(onDeleteMock).toBeCalledTimes(1);
  });

});

describe("ShoppingListItem component -> delete button", () => {

  it('given a non empty item with focus, delete button should be visible', () => {
    const { getByDisplayValue, queryByLabelText } = renderedItemToBuy;
    const input = getByDisplayValue("test1");
    fireEvent.changeText(input, "");
    fireEvent(input, 'onFocus');
    const clearButton = queryByLabelText("clear-button");
    expect(clearButton).not.toBe(null);
  });

  it('given a non empty item without focus, delete button should not be visible', () => {
    const { getByDisplayValue, queryByLabelText } = renderedItemToBuy;
    const input = getByDisplayValue("test1");
    fireEvent.changeText(input, "");
    fireEvent(input, 'onBlur');
    const clearButton = queryByLabelText("clear-button");
    expect(clearButton).toBe(null);
  });

  it('given a non empty item, onDelete function should be called if delete button clicked', () => {
    const { getByDisplayValue, getByLabelText } = renderedItemToBuy;
    const input = getByDisplayValue("test1");
    fireEvent(input, 'onFocus');
    const clearButton = getByLabelText("clear-button");
    fireEvent(clearButton, "onPress");
    expect(onDeleteMock).toBeCalledTimes(1);
    expect(onDeleteMock).toBeCalledWith(itemToBuy);
  });

});

describe("ShoppingListItem component -> check button", () => {

  it('given a non empty item without purchase date, radio-button-unchecked icon is displayed', () => {
    const { getByLabelText } = renderedItemToBuy;
    const checkButton = getByLabelText("check-button");
    expect(getIconName(checkButton)).toBe("radio-button-unchecked")
  });

  it('given a non empty item with purchase date, check-circle icon is displayed', () => {
    const { getByLabelText } = renderedItemBought;
    const checkButton = getByLabelText("check-button");
    expect(getIconName(checkButton)).toBe("check-circle")
  });

  // it('given a non empty item without purchase date, onCheckPressed function should be called with value true', () => {
  //   const { getByLabelText } = renderedItemToBuy;
  //   const checkButton = getByLabelText("check-button");
  //   fireEvent(checkButton, "onPress");
  //   //TODO handle animation
  //   expect(onCheckPressedMock).toBeCalledTimes(1);
  //   expect(onCheckPressedMock).toBeCalledWith(true, itemToBuy);
  // });
  //
  // it('given a non empty item with purchase date, onCheckPressed function should be called with value false', () => {
  //   const { getByLabelText } = renderedItemBought;
  //   const checkButton = getByLabelText("check-button");
  //   fireEvent(checkButton, "onPress");
  //   //TODO handle animation
  //   expect(onCheckPressedMock).toBeCalledTimes(1);
  //   expect(onCheckPressedMock).toBeCalledWith(false, itemBought);
  // });

});

describe("ShoppingListItem component -> fridge button", () => {

  it('given a non empty item without purchase date, fridge button should not be visible', () => {
    const { queryByLabelText } = renderedItemToBuy;
    const fridgeButton = queryByLabelText("fridge-button");
    expect(fridgeButton).toBe(null);
  });

  it('given a non empty item with purchase date, fridge button should be visible', () => {
    const { queryByLabelText } = renderedItemBought;
    const fridgeButton = queryByLabelText("fridge-button");
    expect(fridgeButton).not.toBe(null);
  });

  it('given a non empty item with purchase date, navigation should be called when fridge button clicked', () => {
    const { getByLabelText } = renderedItemBought;
    const fridgeButton = getByLabelText("fridge-button");
    fireEvent.press(fridgeButton);
    expect(mockedNavigate).toBeCalledTimes(1);
    expect(mockedNavigate).toBeCalledWith(Screens.ADD_PRODUCT_SCREEN, {"name": itemBought.title, "origin": Screens.SHOPPING_LIST_SCREEN});
  });

});
