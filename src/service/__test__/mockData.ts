import ProductDefDto from "../../dto/Product/ProductDefDto";
import ProductDto from "../../dto/Product/ProductDto";
import DateUtils from "../../utils/DateUtils";
import ActivityDto from "../../dto/ActivityDto";
import {ProductActions} from "../../data/productActionsData";

const productDef1 = new ProductDefDto('Apple', 'item', 'apple', '');
const productDef2 = new ProductDefDto('Banana', 'item', 'banana', '');
const productDef3 = new ProductDefDto('Juice', 'bottle', 'juice', '');

const product1: ProductDto = {
  _id: "1",
  definition: productDef1,
  partitionKey: "",
  description: "",
  unitValue: 7,
  expirationDate: DateUtils.convertStringToDate('2020-08-27'),
  isActive: true,
  creationDate: DateUtils.convertStringToDate('2020-08-27')
}

const product2: ProductDto = {
  _id: "2",
  definition: productDef1,
  partitionKey: "",
  description: "",
  unitValue: 2,
  expirationDate: DateUtils.convertStringToDate('2020-09-13'),
  isActive: true,
  creationDate: DateUtils.convertStringToDate('2020-09-10')
}

const product3: ProductDto = {
  _id: "3",
  definition: productDef2,
  partitionKey: "",
  description: "",
  unitValue: 4,
  expirationDate: DateUtils.convertStringToDate('2020-10-24'),
  isActive: true,
  creationDate: DateUtils.convertStringToDate('2020-09-10')
}

const activity1: ActivityDto = {
  _id: "1",
  partitionKey: "",
  actionDate: DateUtils.convertStringToDate('2020-10-24'),
  actionType: ProductActions.ADD,
  unitValue: 3,
  product: product1,
  isActive: true,
  creationDate: DateUtils.convertStringToDate('2020-10-24')
}

const activity2: ActivityDto = {
  _id: "2",
  partitionKey: "",
  actionDate: DateUtils.convertStringToDate('2020-10-24'),
  actionType: ProductActions.ADD,
  unitValue: 2,
  product: product1,
  isActive: true,
  creationDate: DateUtils.convertStringToDate('2020-10-24')
}

const activity3: ActivityDto = {
  _id: "3",
  partitionKey: "",
  actionDate: DateUtils.convertStringToDate('2020-10-24'),
  actionType: ProductActions.CONSUME,
  unitValue: 8,
  product: product1,
  isActive: true,
  creationDate: DateUtils.convertStringToDate('2020-10-24')
}

const activity4: ActivityDto = {
  _id: "4",
  partitionKey: "",
  actionDate: DateUtils.convertStringToDate('2020-10-24'),
  actionType: ProductActions.THROW_AWAY,
  unitValue: 1,
  product: product3,
  isActive: true,
  creationDate: DateUtils.convertStringToDate('2020-10-24')
}

export function getProductDefinitionSet() {
  return [Object.assign(productDef1), Object.assign(productDef2), Object.assign(productDef3)];
}

export function getActivitySet() {
  return [Object.assign(activity1), Object.assign(activity2), Object.assign(activity3), Object.assign(activity4)];
}
