import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import moment from "moment";
import 'moment/locale/pl';

RNLocalize.addEventListener("change", () => {
  i18n.changeLanguage(getLanguageCode());
  moment.locale(i18n.language);
});

function getLanguageCode() {
  return RNLocalize.findBestAvailableLanguage(["en", "pl"])?.languageTag || "en";
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: require("../../assets/translations/en.json"),
      pl: require("../../assets/translations/pl.json"),
    },
    lng: getLanguageCode(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
export function useDefaultTranslation(ns: string) {
  return useTranslation(ns, {i18n});
}
