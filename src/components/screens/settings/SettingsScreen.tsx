import React from 'react'
import {Image, StyleSheet, View} from 'react-native'
import i18n, {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import TopHeader from "../../layout/TopHeader/TopHeader";
import {useNavigation} from "@react-navigation/native";
import {Screens} from "../../../navigation/Screens";
import ConnectionStatusIndicator from "../../layout/common/ConnectionStatusIndicator";
import {useAuth} from "../../../providers/AuthProvider";
import {useData} from "../../../providers/DataProvider";
import SettingsButton from "../../layout/inputs/SettingsButton";
import {T2} from "../../layout/Text/Text";
import DeviceInfo from 'react-native-device-info';
import COLORS from "../../../../assets/colors";
import Config from "react-native-config";
const logo = require("../../../../assets/icons/logo.png");

const appVersion = DeviceInfo.getVersion();
const AppInfo = () => {
  return (
    <View style={styles.appVersionContainer}>
      <Image source={logo} style={styles.logo} resizeMode={"stretch"} />
      <T2>{i18n.t("settings:version")}: {appVersion}</T2>
    </View>
  )
}

export default function SettingsScreen() {

  const { t } = useDefaultTranslation('settings');
  const navigation = useNavigation();
  const { user } = useAuth();
  const { connectionStatus } = useData();

  console.log("Config.MONGO_ENABLE_EXTERNAL: ", Config.MONGO_ENABLE_EXTERNAL);

  return (
    <View style={styles.container}>
      <TopHeader title={t("header")} isMainScreen={true}/>
      <AppInfo />
      { Config.MONGO_ENABLE_EXTERNAL === 'true' &&
        <SettingsButton label={i18n.t("myProfile:header")} onPress={() => navigation.navigate(Screens.MY_PROFILE_SCREEN)} />
      }
      <SettingsButton label={i18n.t("userData:header")} onPress={() => navigation.navigate(Screens.USER_DATA_SCREEN)} />
      <SettingsButton label={i18n.t("productsLibrary:header")} onPress={() => navigation.navigate(Screens.PRODUCTS_LIBRARY_SCREEN)} />
      <SettingsButton label={i18n.t("productCategories:header")} onPress={() => navigation.navigate(Screens.PRODUCT_CATEGORIES_SCREEN)} />
      <SettingsButton label={i18n.t("librariesAndIcons:header")} onPress={() => navigation.navigate(Screens.LIBRARIES_AND_ICONS_SCREEN)} />
      <SettingsButton label={i18n.t("logs:header")} onPress={() => navigation.navigate(Screens.LOGS_SCREEN)} />
      {user && <ConnectionStatusIndicator connectionStatus={connectionStatus} isVisible={true} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
  appVersionContainer: {
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
  }
})
