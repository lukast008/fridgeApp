import ActivityTypeDto from "../dto/ActivityTypeDto";
import COLORS from "../../assets/colors";
import i18n from "../utils/TranslationsUtils";

export const ProductActions = {
  ADD: "add",
  EDIT: "edit",
  DELETE: "delete",
  CONSUME: "consume",
  THROW_AWAY: "throw away"
}

export const productActions: ActivityTypeDto[] = [
  {
    name: ProductActions.ADD,
    iconName: "add",
    listIconName: "add",
    iconColor: COLORS.primary,
    buttonColor: COLORS.primary,
    isExpirationDateRequired: true,
    label: i18n.t("action:add.label"),
    actionDateLabel: i18n.t("action:add.dateLabel"),
    descriptionDone: i18n.t("action:add.doneLabel"),
    hasDescriptionDoneUnits: true,
  },
  {
    name: ProductActions.EDIT,
    iconName: "create",
    iconColor: COLORS.primary,
    buttonColor: COLORS.primary,
    isExpirationDateRequired: true,
    label: i18n.t("action:edit.label"),
    actionDateLabel: i18n.t("action:edit.dateLabel"),
    descriptionDone: i18n.t("action:edit.doneLabel"),
    hasDescriptionDoneUnits: false,
  },
  {
    name: ProductActions.DELETE,
    iconName: "block",
    listIconName: "block",
    iconColor: COLORS.invalid,
    buttonColor: COLORS.primary,
    isExpirationDateRequired: true,
    label: i18n.t("action:delete.label"),
    actionDateLabel: i18n.t("action:delete.dateLabel"),
    descriptionDone: i18n.t("action:delete.doneLabel"),
    hasDescriptionDoneUnits: false,
  },
  {
    name: ProductActions.CONSUME,
    iconName: "mood",
    listIconName: "trending-down",
    iconColor: COLORS.green,
    buttonColor: COLORS.green,
    isExpirationDateRequired: false,
    label: i18n.t("action:consume.label"),
    actionDateLabel: i18n.t("action:consume.dateLabel"),
    descriptionDone: i18n.t("action:consume.doneLabel"),
    hasDescriptionDoneUnits: true,
  },
  {
    name: ProductActions.THROW_AWAY,
    iconName: "delete-forever",
    listIconName: "trending-down",
    iconColor: COLORS.invalid,
    buttonColor: COLORS.invalid,
    isExpirationDateRequired: false,
    label: i18n.t("action:throwAway.label"),
    actionDateLabel: i18n.t("action:throwAway.dateLabel"),
    descriptionDone: i18n.t("action:throwAway.doneLabel"),
    hasDescriptionDoneUnits: true,
  }
];
