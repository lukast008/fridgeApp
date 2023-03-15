
export default class ProductCreateDto {
  _id?: string;
  name: string;
  unitName: string;
  iconName: string;
  partitionKey: string;
  description: string;
  unitValue: number;
  expirationDate: Date;
  isActive: boolean;
  creationDate: Date;
  isOpen: boolean;

  constructor(_id: string | undefined, name: string, unitName: string, iconName: string, description: string, unitValue: number, expirationDate: Date, creationDate: Date) {
    this._id = _id;
    this.name = name;
    this.unitName = unitName;
    this.iconName = iconName;
    this.description = description;
    this.unitValue = unitValue;
    this.expirationDate = expirationDate;
    this.isActive = true;
    this.creationDate = creationDate;
    this.isOpen = false;
  }
}
