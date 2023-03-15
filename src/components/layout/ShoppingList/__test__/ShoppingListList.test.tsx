import * as React from 'react'
import {fireEvent, render} from '@testing-library/react-native';
import ShoppingListList from "../ShoppingListList";
import {realmMock} from "../../../../database/__mocks__/realm";
import ShoppingListItemModel from "../../../../database/ShoppingListItemModel";
import {MOCK_ITEMS_BOUGHT, MOCK_ITEMS_TO_BUY} from "./data";
import {act} from "react-test-renderer";

jest.mock('react-native-get-random-values', () => '');
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

jest.mock('../../../../providers/DataProvider');

describe("ShoppingListList component", () => {

  it('given non empty list, user can see all elements', async () => {
    // given when
    realmMock.init(ShoppingListItemModel.schema.name, [...MOCK_ITEMS_BOUGHT, ...MOCK_ITEMS_TO_BUY]);
    const { findAllByLabelText } = render(<ShoppingListList />);
    const inputs = await findAllByLabelText(/^shopping-list-item_/);

    //then
    expect(inputs.length).toBe(15);
  });

  it('given empty list, user should see only add product button', async () => {
    // given when
    realmMock.init(ShoppingListItemModel.schema.name, []);
    const { queryAllByLabelText, getByLabelText } = render(<ShoppingListList />);
    const inputs = await queryAllByLabelText(/^shopping-list-item_/);
    const addButton = getByLabelText("shopping-list-add-button");

    //then
    expect(inputs.length).toBe(0);
    expect(addButton).not.toBeNull();
  });

  it('given non empty list, user can edit an element', async () => {
    // given
    realmMock.init(ShoppingListItemModel.schema.name, [...MOCK_ITEMS_BOUGHT, ...MOCK_ITEMS_TO_BUY]);
    const { findAllByLabelText } = render(<ShoppingListList />);
    const inputs = await findAllByLabelText(/^shopping-list-item-input_/);

    // when
    fireEvent.changeText(inputs[0], "new value");
    fireEvent(inputs[0], "onEndEditing");

    // then
    const updatedInputs = await findAllByLabelText(/^shopping-list-item-input_/);
    expect(updatedInputs.length).toBe(15);
    expect(updatedInputs[0].props["value"]).toBe("new value");
    const savedItemsInDB = realmMock.objects(ShoppingListItemModel.schema.name);
    expect(savedItemsInDB.length).toBe(15);
  });

  it('given non empty list, user can add an element', async () => {
    // given
    realmMock.init(ShoppingListItemModel.schema.name, [...MOCK_ITEMS_BOUGHT, ...MOCK_ITEMS_TO_BUY]);
    const { getByLabelText, getByPlaceholderText, findAllByLabelText } = render(<ShoppingListList />);
    const addButton = getByLabelText("shopping-list-add-button");

    // when
    fireEvent.press(addButton);
    const input = getByPlaceholderText("Enter name");
    fireEvent.changeText(input, "new value");
    fireEvent(input, "onSubmitEditing");

    // then
    const updatedInputs = await findAllByLabelText(/^shopping-list-item-input_/, { timeout: 2000 });
    expect(updatedInputs.length).toBe(16);
    const savedItemsInDB = realmMock.objects(ShoppingListItemModel.schema.name);
    const lastItem = savedItemsInDB.slice(-1)[0];
    expect(savedItemsInDB.length).toBe(16);
    expect(lastItem.title).toBe("new value");
    expect(lastItem.isActive).toBe(true);
  });

  it('given non empty list, user can delete an element', async () => {
    // given
    realmMock.init(ShoppingListItemModel.schema.name, [...MOCK_ITEMS_BOUGHT, ...MOCK_ITEMS_TO_BUY]);
    const {findAllByLabelText, getByLabelText} = render(<ShoppingListList/>);
    const inputs = await findAllByLabelText(/^shopping-list-item-input_/);

    // when
    fireEvent(inputs[0], "onFocus");
    const clearButton = getByLabelText("clear-button");
    fireEvent(clearButton, "onPress");

    // then
    const updatedInputs = await findAllByLabelText(/^shopping-list-item-input_/, { timeout: 2000 });
    expect(updatedInputs.length).toBe(14);
    await new Promise((r) => setTimeout(r, 2000));
    const savedItemsInDB = realmMock.objects(ShoppingListItemModel.schema.name);
    expect(savedItemsInDB.length).toBe(14);
  });

  it('given non empty list of items to buy, user can check an element', async () => {
    // given
    realmMock.init(ShoppingListItemModel.schema.name, [...MOCK_ITEMS_BOUGHT, ...MOCK_ITEMS_TO_BUY]);
    const {findAllByLabelText} = render(<ShoppingListList/>);
    const checkButtons = await findAllByLabelText(/^check-button/);

    // when
    await act(async () => {
      fireEvent(checkButtons[0], "onPress");
      await new Promise((r) => setTimeout(r, 1000));
    });

    // then
    const updatedItemsToBuy = await findAllByLabelText(/^shopping-list-item_toBuy_/, { timeout: 2000 });
    expect(updatedItemsToBuy.length).toBe(4);
    const updatedItemsBought = await findAllByLabelText(/^shopping-list-item_bought_/, { timeout: 2000 });
    expect(updatedItemsBought.length).toBe(11);
  });

  it('given non empty list of bought items, user can uncheck an element', async () => {
    // given
    realmMock.init(ShoppingListItemModel.schema.name, [...MOCK_ITEMS_BOUGHT, ...MOCK_ITEMS_TO_BUY]);
    const {findAllByLabelText} = render(<ShoppingListList/>);
    const checkButtons = await findAllByLabelText(/^check-button/);

    // when
    await act(async () => {
      fireEvent(checkButtons[checkButtons.length-1], "onPress");
      await new Promise((r) => setTimeout(r, 1000));
    });

    // then
    const updatedItemsToBuy = await findAllByLabelText(/^shopping-list-item_toBuy_/, { timeout: 2000 });
    expect(updatedItemsToBuy.length).toBe(6);
    const updatedItemsBought = await findAllByLabelText(/^shopping-list-item_bought_/, { timeout: 2000 });
    expect(updatedItemsBought.length).toBe(9);
  });
});
