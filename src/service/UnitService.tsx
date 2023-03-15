import { units } from "../data/unitsData";
import UnitDto from "src/dto/UnitDto";

class UnitService {

  getDefaultUnit = () => {
    return units[0];
  }

  getAllUnits = () => {
    return units;
  }

  getUnitNameForNumber = (unitName: string, value: number) => {
    let unit: UnitDto = this.getUnitByName(unitName);
    if(unit) {
      if(Number.isInteger(value)) {
        if(value === 1) return unit.nameIf1;
        else if(value >= 2 && value <= 4) return unit.nameIf2to4;
        else return unit.nameIf5orMore;
      } else {
        return unit.nameIfFraction;
      }
    }
  }

  getUnitByName = (name: string) => {
    return units.filter(item => item.name === name)[0];
  }

  isUnitValueValid = (value: number, maxUnitValue?: number) => {
    return (value > 0 && (!maxUnitValue || value <= maxUnitValue));
  }
}

export const unitService = new UnitService();
