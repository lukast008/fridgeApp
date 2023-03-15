import { useReducer } from 'react';
import DateUtils from "../../../utils/DateUtils";
import UnitDto from "../../../dto/UnitDto";
import {unitService} from "../../../service/UnitService";
import IconDto from "../../../dto/IconDto";
import IconService from "../../../service/IconService";
import ProductCategoryDto from "../../../dto/Product/ProductCategoryDto";
import ProductDefDto from "../../../dto/Product/ProductDefDto";
import ProductDto from "../../../dto/Product/ProductDto";
import {ObjectId} from "bson";
import ProductSuggestionDto from "../../../dto/Product/ProductSuggestionDto";
import {defaultLogger} from "../../../providers/AppInfoProvider";

enum ActionTypes {
  SET_NAME = 'SET_NAME',
  SET_DESCRIPTION = 'SET_DESCRIPTION',
  SET_EXPIRATION_DATE = 'SET_EXPIRATION_DATE',
  SET_ACTION_DATE = 'SET_ACTION_DATE',
  SET_UNIT = 'SET_UNIT',
  SET_UNIT_VALUE = 'SET_UNIT_VALUE',
  SET_MASS_VALUE = 'SET_MASS_VALUE',
  SET_ICON = 'SET_ICON',
  SET_CATEGORY = 'SET_CATEGORY',
  SET_PRODUCT_DEF_ID = 'SET_PRODUCT_DEF_ID',
  SET_PRODUCT_DEF_LIBRARY = 'SET_PRODUCT_DEF_LIBRARY',
  SET_PRODUCT = 'SET_PRODUCT',
  SET_PRODUCT_SUGGESTION = 'SET_PRODUCT_SUGGESTION',
}

type Action =
  | { type: ActionTypes.SET_NAME; payload: string }
  | { type: ActionTypes.SET_DESCRIPTION; payload: string }
  | { type: ActionTypes.SET_EXPIRATION_DATE; payload?: Date }
  | { type: ActionTypes.SET_ACTION_DATE; payload: Date }
  | { type: ActionTypes.SET_UNIT; payload: string }
  | { type: ActionTypes.SET_UNIT_VALUE; payload: number }
  | { type: ActionTypes.SET_MASS_VALUE; payload: number }
  | { type: ActionTypes.SET_ICON; payload: IconDto }
  | { type: ActionTypes.SET_CATEGORY; payload?: ProductCategoryDto }
  | { type: ActionTypes.SET_PRODUCT_DEF_ID; payload: ObjectId }
  | { type: ActionTypes.SET_PRODUCT_DEF_LIBRARY; payload: ProductDefDto[] }
  | { type: ActionTypes.SET_PRODUCT; payload?: ProductDto | null }
  | { type: ActionTypes.SET_PRODUCT_SUGGESTION; payload?: ProductSuggestionDto }
;

interface State {
  name: string;
  description: string;
  expirationDate?: Date;
  actionDate: Date;
  unit: UnitDto;
  unitValue: number;
  massValue: number;
  icon: IconDto;
  category?: ProductCategoryDto;
  isValid: boolean;
  isIconSelectedByUser: boolean;
  id?: string;
  productDefs?: ProductDefDto[];
  selectedProductDef?: ProductDefDto;
  isSuggestionsListVisible: boolean;
}

const initialState: State = {
  name: "",
  description: "",
  expirationDate: DateUtils.addDaysToDate(new Date(), 7),
  actionDate: new Date(),
  unit: unitService.getDefaultUnit(),
  unitValue: 1,
  massValue: 0,
  icon: IconService.getDefaultIcon(),
  isValid: false,
  isIconSelectedByUser: false,
  isSuggestionsListVisible: false,
}

const reducer = (state: State, action: Action) => {
  defaultLogger.debug("AddProduct: " + action.type, action);
  switch (action.type) {
    case ActionTypes.SET_NAME:
      const name = action.payload;
      const suggestedIcon = state.isIconSelectedByUser ? state.icon : IconService.findIconForName(name);
      return {
        ...state,
        name: name,
        icon: suggestedIcon,
        isValid: validateName(name) && validateUnitValue(state.unitValue),
        selectedProductDef: state.productDefs && findProductDef(state.productDefs, name, state.unit.name),
        isSuggestionsListVisible: name.length > 0
      };
    case ActionTypes.SET_DESCRIPTION:
      return {...state, description: action.payload};
    case ActionTypes.SET_EXPIRATION_DATE:
      return {...state, expirationDate: action.payload};
    case ActionTypes.SET_ACTION_DATE:
      return {...state, actionDate: action.payload};
    case ActionTypes.SET_UNIT:
      return {
        ...state,
        unit: unitService.getUnitByName(action.payload),
        selectedProductDef: state.productDefs && findProductDef(state.productDefs, state.name, action.payload)
      };
    case ActionTypes.SET_UNIT_VALUE:
      return {
        ...state,
        unitValue: action.payload,
        isValid: validateName(state.name) && validateUnitValue(action.payload),
      };
    case ActionTypes.SET_MASS_VALUE:
      return {...state, massValue: action.payload};
    case ActionTypes.SET_ICON:
      return {...state, icon: action.payload, isIconSelectedByUser: true};
    case ActionTypes.SET_CATEGORY:
      return {...state, category: action.payload};
    case ActionTypes.SET_PRODUCT_DEF_ID:
      const productDef = state.productDefs?.filter(product => product._id.equals(action.payload))[0];
      if(!productDef) return {...state, selectedProductDef: undefined};
      return {
        ...state,
        selectedProductDef: productDef,
        name: productDef.name,
        unit: unitService.getUnitByName(productDef.unitName),
        icon: IconService.getIconByName(productDef.iconName),
        category: productDef.category,
        isValid: validateName(productDef.name) && validateUnitValue(state.unitValue),
      };
    case ActionTypes.SET_PRODUCT_DEF_LIBRARY:
      return {...state, productDefs: action.payload}
    case ActionTypes.SET_PRODUCT:
      const productDto = action.payload;
      if(!productDto) return {...state, id: undefined};
      return {
        ...state,
        id: productDto._id,
        name: productDto.definition.name,
        description: productDto.description,
        icon: IconService.getIconByName(productDto.definition.iconName),
        category: productDto.definition.category,
        unitValue: productDto.unitValue,
        massValue: productDto.massValuePerUnit || 0,
        unit: unitService.getUnitByName(productDto.definition.unitName),
        expirationDate: !DateUtils.isInfinityDate(productDto.expirationDate) ? productDto.expirationDate : undefined,
        actionDate: productDto.creationDate,
        selectedProductDef: productDto.definition,
        isValid: validateName(productDto.definition.name) && validateUnitValue(productDto.unitValue),
        isIconSelectedByUser: false,
      }
    case ActionTypes.SET_PRODUCT_SUGGESTION:
      const productSuggestion = action.payload;
      if(!productSuggestion) return {...state, isSuggestionsListVisible: false};

      const daysToExpire = productSuggestion.daysToExpire;
      return {
        ...state,
        name: productSuggestion.productDef.name,
        unit: unitService.getUnitByName(productSuggestion.productDef.unitName),
        icon: IconService.getIconByName(productSuggestion.productDef.iconName),
        category: productSuggestion.productDef.category,
        expirationDate: daysToExpire < 365 ? DateUtils.addDaysToDate(new Date(), daysToExpire) : undefined,
        unitValue: productSuggestion.unitValue,
        massValue: productSuggestion.massValue,
        selectedProductDef: state.productDefs?.filter(product => product._id.equals(productSuggestion.productDef._id))[0],
        isValid: validateName(productSuggestion.productDef.name) && validateUnitValue(productSuggestion.unitValue),
        isIconSelectedByUser: false,
        isSuggestionsListVisible: false,
      }
  }
}

const validateName = (name: string) => !!name && name.trim() !== "";
const validateUnitValue = (unitValue: number) => unitValue > 0;
const findProductDef = (productDefs: ProductDefDto[], name: string, unit: string) => {
  const products = productDefs.filter(item => item.name === name && item.unitName === unit);
  return products.length === 1 ? products[0] : undefined;
}

export const useAddProductReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setName = (name: string) => dispatch({type: ActionTypes.SET_NAME, payload: name});
  const setDescription = (description: string) => dispatch({type: ActionTypes.SET_DESCRIPTION, payload: description});
  const setExpirationDate = (date?: Date) => dispatch({type: ActionTypes.SET_EXPIRATION_DATE, payload: date});
  const setActionDate = (date: Date) => dispatch({type: ActionTypes.SET_ACTION_DATE, payload: date});
  const setUnit = (unitName: string) => dispatch({type: ActionTypes.SET_UNIT, payload: unitName});
  const setUnitValue = (unitValue: number) => dispatch({type: ActionTypes.SET_UNIT_VALUE, payload: unitValue});
  const setMassValue = (massValue: number) => dispatch({type: ActionTypes.SET_MASS_VALUE, payload: massValue});
  const setIcon = (icon: IconDto) => dispatch({type: ActionTypes.SET_ICON, payload: icon});
  const setCategory = (category?: ProductCategoryDto) => dispatch({type: ActionTypes.SET_CATEGORY, payload: category});
  const setProductDefId = (productDefId: ObjectId) => dispatch({type: ActionTypes.SET_PRODUCT_DEF_ID, payload: productDefId});
  const setProductDefLibrary = (productDefs: ProductDefDto[]) => dispatch({type: ActionTypes.SET_PRODUCT_DEF_LIBRARY, payload: productDefs});
  const setProduct = (productDto?: ProductDto | null) => dispatch({type: ActionTypes.SET_PRODUCT, payload: productDto});
  const setProductSuggestion = (productSuggestion?: ProductSuggestionDto) => dispatch({type: ActionTypes.SET_PRODUCT_SUGGESTION, payload: productSuggestion});

  return {state, setName, setDescription, setExpirationDate, setActionDate, setUnit, setUnitValue, setMassValue,
    setIcon, setCategory, setProductDefId, setProductDefLibrary, setProduct, setProductSuggestion}
}
