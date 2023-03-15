import React from 'react'
import {StyleSheet, View} from "react-native";
import StatisticsDto from "../../../dto/StatisticsDto";
import {T2, T4} from "../Text/Text";
import {Card} from "react-native-elements";
import {unitService} from "../../../service/UnitService";
import TextNumberUtils from "../../../utils/TextNumberUtils";
import {ProductActions} from "../../../data/productActionsData";
import COLORS from "../../../../assets/colors";
import ActivityTypeDto from "../../../dto/ActivityTypeDto";
import {productService} from "../../../service/ProductService";
import StatisticsChart from "./StatisticsChart";

type Props = {
  statistics: StatisticsDto;
}

export default function SummaryStatistics(props: Props) {

  function renderSum(statistics: StatisticsDto, type: string, borderRight: boolean) {
    const sum = statistics.sumByType.get(type);
    const actionDto: ActivityTypeDto = productService.getProductAction(type);
    const borderRightWidth = borderRight ? 2 : 0;
    return (
      <View style={[styles.column, {borderRightWidth: borderRightWidth}]}>
        <T4 style={styles.tableHeader}>{actionDto.descriptionDone}</T4>
        {sum &&
        <>
            <T2 style={{marginTop: 5}}>{TextNumberUtils.convertNumberToString(sum)}</T2>
            <T4>{unitService.getUnitNameForNumber(statistics.unitName, sum)}</T4>
        </>
        }
        {!sum && <T2>-</T2>}
      </View>
    );
  }

  function render() {
    return (
      <Card containerStyle={styles.card}>
        <View style={styles.row}>
          {renderSum(props.statistics, ProductActions.ADD, true)}
          {renderSum(props.statistics, ProductActions.CONSUME, true)}
          {renderSum(props.statistics, ProductActions.THROW_AWAY, false)}
        </View>
        {/*<StatisticsChart statistics={props.statistics} />*/}
      </Card>
    );
  }

  return render();
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginTop: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flex: 1,
    borderColor: COLORS.primary,
    marginTop: 5,
    padding: 2,
    alignItems: "center",
    height: "100%",
  },
  tableHeader: {
    borderColor: COLORS.primary,
    borderBottomWidth: 2,
    textAlign: "center",
    paddingBottom: 2,
    width: "100%"
  },
})
