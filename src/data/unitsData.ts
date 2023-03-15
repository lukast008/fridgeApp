import UnitDto from "../dto/UnitDto";
import i18n from "../utils/TranslationsUtils";

export const MassUnits = {
  KILOGRAM: "kilogram",
  LITER: "liter"
}

export const units: UnitDto[] = [
  {
    name: "item",
    iconName: "",
    massUnit: MassUnits.KILOGRAM,
    nameIf1: i18n.t("unit:item.name"),
    nameIf2to4: i18n.t("unit:item.nameIf2to4"),
    nameIf5orMore: i18n.t("unit:item.nameIf5orMore"),
    nameIfFraction: i18n.t("unit:item.nameIfFraction"),
  },
  {
    name: "bottle",
    iconName: "",
    massUnit: MassUnits.LITER,
    nameIf1: i18n.t("unit:bottle.name"),
    nameIf2to4: i18n.t("unit:bottle.nameIf2to4"),
    nameIf5orMore: i18n.t("unit:bottle.nameIf5orMore"),
    nameIfFraction: i18n.t("unit:bottle.nameIfFraction"),
  },
  {
    name: "package",
    iconName: "",
    massUnit: MassUnits.KILOGRAM,
    nameIf1: i18n.t("unit:package.name"),
    nameIf2to4: i18n.t("unit:package.nameIf2to4"),
    nameIf5orMore: i18n.t("unit:package.nameIf5orMore"),
    nameIfFraction: i18n.t("unit:package.nameIfFraction"),
  },
  {
    name: "carton",
    iconName: "",
    massUnit: MassUnits.LITER,
    nameIf1: i18n.t("unit:carton.name"),
    nameIf2to4: i18n.t("unit:carton.nameIf2to4"),
    nameIf5orMore: i18n.t("unit:carton.nameIf5orMore"),
    nameIfFraction: i18n.t("unit:carton.nameIfFraction"),
  },
  {
    name: "can",
    iconName: "",
    massUnit: MassUnits.KILOGRAM,
    nameIf1: i18n.t("unit:can.name"),
    nameIf2to4: i18n.t("unit:can.nameIf2to4"),
    nameIf5orMore: i18n.t("unit:can.nameIf5orMore"),
    nameIfFraction: i18n.t("unit:can.nameIfFraction"),
  },
  {
    name: "portion",
    iconName: "",
    massUnit: MassUnits.KILOGRAM,
    nameIf1: i18n.t("unit:portion.name"),
    nameIf2to4: i18n.t("unit:portion.nameIf2to4"),
    nameIf5orMore: i18n.t("unit:portion.nameIf5orMore"),
    nameIfFraction: i18n.t("unit:portion.nameIfFraction"),
  },
  {
    name: "jar",
    iconName: "",
    massUnit: MassUnits.LITER,
    nameIf1: i18n.t("unit:jar.name"),
    nameIf2to4: i18n.t("unit:jar.nameIf2to4"),
    nameIf5orMore: i18n.t("unit:jar.nameIf5orMore"),
    nameIfFraction: i18n.t("unit:jar.nameIfFraction"),
  },
];
