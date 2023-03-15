export default class TextNumberUtils {

  static convertNumberToString = (value: number) => {
    if(Number.isInteger(value) || Math.abs(value - Number.parseInt(value.toString())) < 0.0001) {
      return value.toString();
    } else {
      return value.toFixed(2);
    }
  }

  static convertStringToNumber = (value: string) => {
    return value ? TextNumberUtils.roundNumber(Number.parseFloat(value.replace(",", "."))) : 0;
  }

  static roundNumber(value: number) {
    return Math.round((value + 0.0001) * 100) / 100;
  }

  static parseStringAsNumber = (value: string) => {
    return value
      .replace("-", "")
      .replace(",", ".")
      .replace(/[^\d.]/g, '')
      .replace(/\..*/, c => "." + c.replace(/\./g, () => ""));
  }
}
