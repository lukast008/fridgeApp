import React, {useMemo} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import StatisticsCard from "./StatisticsCard";
import COLORS from "../../../../assets/colors";
import {T1, T3} from "../Text/Text";
import {ProductActions} from "../../../data/productActionsData";
import ActivityTypeDto from "../../../dto/ActivityTypeDto";
import {productService} from "../../../service/ProductService";
import DateFilterDto from "../../../dto/DateFilterDto";
import {Icon} from "react-native-elements";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import {statisticsService} from "../../../service/StatisticsService";
import LoadingIndicator from "../common/LoadingIndicator";
import {useData} from "../../../providers/DataProvider";
import StatisticsDto from "../../../dto/StatisticsDto";
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview";
import {useActivities} from "../../../providers/ActivitiesProvider";

type Props = {
  searchValue: string;
  filterData: DateFilterDto;
  onProductSelected: (productDefId: ObjectId) => void;
}

const { width } = Dimensions.get("window");

const getListDataProvider = new DataProvider((r1: StatisticsDto, r2: StatisticsDto) => {
  return r1._id !== r2._id || r1.isOnShoppingList !== r2.isOnShoppingList;
});

export default function StatisticsList(props: Props) {

  const { t } = useDefaultTranslation("statistics");
  const { products, shoppingListProvider } = useData();
  const { itemsToBuy } = shoppingListProvider;
  const activities = useActivities(props.filterData, "product.definition.name", false, props.searchValue);

  const statistics = useMemo(() => {
    if(!activities) return null;
    return statisticsService.groupStatistics(activities, products);
  }, [activities, products]);

  const statisticsWithShoppingInfo = useMemo(() => {
    if(!statistics || !itemsToBuy) return statistics;
    try {
      return statistics.map(item => {
        return {
          ...item,
          isOnShoppingList: itemsToBuy.filter(shoppingItem => shoppingItem.title === item.name).length > 0
        };
      });
    } catch (e) {
      console.log("ERROR in statisticsWithShoppingInfo: ", e);
      return [];
    }
  }, [statistics, itemsToBuy]);

  const getLayoutProvider = useMemo(() => new LayoutProvider(
    index => 0,
    (type, dim) => {
      dim.width = width;
      dim.height = 125;
    }
  ), []);

  function rowRenderer(type: any, data: StatisticsDto) {
    return <StatisticsCard statistics={data} dateFilter={props.filterData} onProductSelected={props.onProductSelected}/>
  }

  function renderHeader(type: string, borderRight: boolean) {
    const actionDto: ActivityTypeDto = productService.getProductAction(type);
    const borderRightWidth = borderRight ? 2 : 0;
    return (
      <View style={[styles.column, {borderRightWidth: borderRightWidth}]}>
        <T3>{actionDto.descriptionDone}</T3>
      </View>
    );
  }

  function renderEmptyList() {
    return (
      <View style={styles.emptyListContainer}>
        <T1 style={{textAlign: "center"}}>{t("emptyInfo")}</T1>
        <Icon name={'folder-open'} size={50}/>
      </View>
    )
  }

  function renderList() {
    if(!statisticsWithShoppingInfo) return <LoadingIndicator txt={t("loadingInfo")}/>
    else if(statisticsWithShoppingInfo.length === 0 ) return renderEmptyList();
    else {
      return (
        <View style={styles.container}>
          <RecyclerListView
            dataProvider={getListDataProvider.cloneWithRows(statisticsWithShoppingInfo)}
            layoutProvider={getLayoutProvider}
            rowRenderer={rowRenderer}
          />
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {renderHeader(ProductActions.ADD, true)}
        {renderHeader(ProductActions.CONSUME, true)}
        {renderHeader(ProductActions.THROW_AWAY, false)}
      </View>
      {renderList()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: COLORS.background,
    elevation: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  column: {
    flex: 1,
    borderColor: COLORS.primary,
    marginTop: 5,
    padding: 2,
    alignItems: "center",
    height: "100%",
  },
  emptyListContainer: {
    margin: 30,
    alignItems: "center",
  }
});
