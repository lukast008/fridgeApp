import React, {useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {T3} from "../Text/Text";
import COLORS from "../../../../assets/colors";
import ActivityGroupDto from "../../../dto/ActivityGroupDto";
import ActivityDto from "../../../dto/ActivityDto";
import {unitService} from "../../../service/UnitService";
import TextNumberUtils from "../../../utils/TextNumberUtils";
import {Card, Icon} from "react-native-elements";
import ActivityTypeDto from "../../../dto/ActivityTypeDto";
import {productService} from "../../../service/ProductService";
import DateUtils from "../../../utils/DateUtils";
import UndoActivityModal from "../ProductActions/UndoActivityModal";
import ProductDto from "../../../dto/Product/ProductDto";
import {ProductActions} from "../../../data/productActionsData";

type Props = {
  activities: ActivityGroupDto[],
  highlightedProduct?: ProductDto,
}

export default function SummaryActivitiesList(props:Props) {

  const [selectedActivity, setSelectedActivity] = useState<ActivityDto>();

  function onBackdrop() {
    setSelectedActivity(undefined);
  }

  function renderItem({item, index}: any) {
    const borderWidth = index === props.activities.length - 1 ? 0 : 2;
    return (
      <View style={[styles.row, {borderBottomWidth: borderWidth}]}>
        <View style={styles.columnLeft}>
          <T3 style={{textAlign: "right"}}>{DateUtils.convertDateToShortDayString(item.date)}</T3>
        </View>
        <View style={styles.columnRight}>
          {item.items.map((activity: ActivityDto) => {
            const unitValue = activity.unitValue;
            const unit = unitValue ? unitService.getUnitNameForNumber(activity.product.definition.unitName, unitValue) : "";
            const unitValueStr = TextNumberUtils.convertNumberToString(unitValue);
            const unitInfo = activity.actionType === ProductActions.DELETE ? "" : ": " + unitValueStr + " " + unit;
            const actionDto: ActivityTypeDto = productService.getProductAction(activity.actionType);
            const iconName = actionDto.listIconName;
            const backgroundColor = props.highlightedProduct && props.highlightedProduct._id === activity.product._id
              ? COLORS.disabled
              : COLORS.background;
            if(iconName) {
              return (
                <TouchableOpacity key={activity._id} onPress={() => setSelectedActivity(activity)}>
                  <View style={styles.itemRow}>
                    <Icon reverse name={iconName} color={actionDto.iconColor} size={8} iconStyle={styles.icon}/>
                    <View style={[styles.activityContainer, {backgroundColor: backgroundColor}]}>
                      <T3 style={{flex: 1, flexWrap: "wrap", textAlignVertical: "center"}}>{actionDto.descriptionDone + unitInfo}</T3>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }
          })}
        </View>
      </View>
    );
  }

  return (
    <>
      <Card containerStyle={styles.container}>
        <FlatList
          data={props.activities}
          renderItem={renderItem}
          keyExtractor={item => item.day}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          initialNumToRender={15}
          windowSize={15}
        />
        <UndoActivityModal onBackDropPress={onBackdrop} activity={selectedActivity} />
      </Card>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginTop: 0,
    marginBottom: 10,
  },
  title: {
    flex: 1,
    color: COLORS.textLight,
    backgroundColor: COLORS.disabled,
    textAlign: "center",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    borderColor: COLORS.disabled,
    borderBottomWidth: 2,
    paddingVertical: 5,
  },
  columnLeft: {
    flex: 1,
    padding: 5,
    alignItems: "flex-end"
  },
  columnRight: {
    flex: 3,
    marginLeft: 10,
    justifyContent: "center",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    padding: 0,
    margin: 0,
    fontSize: 12,
  },
  description: {
    fontStyle: "italic",
    flexWrap: "wrap",
    flex: 1,
    marginRight: 5,
  },
  activityContainer: {
    borderRadius: 5,
    padding: 5,
    margin: 1,
    flex: 1,
  }
})
