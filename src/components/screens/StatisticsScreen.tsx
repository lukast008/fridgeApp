import React from 'react'
import {StyleSheet, View} from 'react-native'
import ComponentWithDateFilter from "../layout/SwipableList/ComponentWithDateFilter";
import StatisticsList from "../layout/Statistics/StatisticsList";
import {useDefaultTranslation} from "../../utils/TranslationsUtils";
import DateFilterDto from "../../dto/DateFilterDto";
import {Screens} from "../../navigation/Screens";
import {useNavigation} from "@react-navigation/native";

export default function StatisticsScreen() {

  const { t } = useDefaultTranslation('statistics');
  const navigation = useNavigation();

  function onProductSelected(productDefId: ObjectId) {
    navigation.navigate(Screens.PRODUCT_SUMMARY_SCREEN, {
      "definitionId": productDefId
    });
  }

  function renderData(filterData: DateFilterDto, searchValue: string) {
    return(
      <View style={styles.content}>
        <StatisticsList searchValue={searchValue} filterData={filterData} onProductSelected={onProductSelected} />
      </View>
    )
  }

  return (
    <ComponentWithDateFilter
      screenName={t("header")}
      renderData={renderData}
    />
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  }
})
