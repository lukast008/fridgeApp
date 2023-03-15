import React from 'react'
import {FlatList, Linking, StyleSheet, TouchableHighlight, TouchableOpacity, View} from 'react-native'
import i18n, {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import TopHeader from "../../layout/TopHeader/TopHeader";
import {useNavigation} from "@react-navigation/native";
import {T2, T3} from "../../layout/Text/Text";
import {Card} from "react-native-elements";
import COLORS from "../../../../assets/colors";

interface License {
  libraryName: string;
  version: string;
  _license: string;
  homepage: string;
}

interface IconLibrary {
  name: string;
  url: string;
}

const iconLibraries: IconLibrary[] = [
  { name: 'Freepik', url: 'https://www.freepik.com'},
  { name: 'Pixel Perfect', url: 'https://www.flaticon.com/authors/pixel-perfect'},
  { name: 'Smashicons', url: 'https://www.flaticon.com/authors/smashicons'},
  { name: 'ultimatearm', url: 'https://www.flaticon.com/authors/ultimatearm'},
  { name: 'Flat Icons', url: 'https://www.flaticon.com/authors/flat-icons'},
]

const LicenseItem = ({ item }: { item: License }) => {
  return (
    <Card>
      <View style={styles.row}>
        <T2>{item.libraryName}</T2>
      </View>
      <View style={styles.row}>
        <T3 style={{flex: 1}}>{i18n.t("librariesAndIcons:license")}{item._license}</T3>
        <T3>{i18n.t("librariesAndIcons:version")}{item.version}</T3>
      </View>
      {item.homepage &&
        <View style={[styles.row, {borderBottomWidth: 0}]}>
          <TouchableOpacity onPress={() => Linking.openURL(item.homepage)}>
            <T2>{item.homepage}</T2>
          </TouchableOpacity>
        </View>
      }
    </Card>
  );
}

const IconsContainer = () => {
  return (
    <Card>
      <TouchableHighlight onPress={() => Linking.openURL("https://www.flaticon.com/")}>
        <T2>{i18n.t("librariesAndIcons:icons-info")}Flaticon</T2>
      </TouchableHighlight>
      <>
      {iconLibraries.map(item => {
        return (
          <TouchableHighlight key={item.name} style={styles.iconLib} onPress={() => item.url}>
            <T3>{item.name}: {item.url}</T3>
          </TouchableHighlight>
        )
      })}
      </>
    </Card>
  )
}

const licenses: License[] = require('../../../../licenses.json');

export default function LibrariesAndIconsScreen() {

  const { t } = useDefaultTranslation('librariesAndIcons');

  return (
    <View style={styles.container}>
      <TopHeader
        title={t("header")}
        isMainScreen={false}
      />
      <FlatList
        data={licenses}
        renderItem={(item) => <LicenseItem item={item.item} />}
        keyExtractor={item => item.libraryName + item.version}
        ListHeaderComponent={<IconsContainer />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    flexWrap: "wrap",
    borderColor: COLORS.border,
    padding: 10,
  },
  iconLib: {
    padding: 10,
  }
})
