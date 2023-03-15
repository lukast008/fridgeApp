import React from 'react'
import {StyleSheet, View, Image} from 'react-native'
import COLORS from "../../../../assets/colors";
import ActivityDto from "../../../dto/ActivityDto";
import {T1, T2, T3} from "../Text/Text";
import ActivityTypeDto from "../../../dto/ActivityTypeDto";
import {productService} from "../../../service/ProductService";
import IconService from "../../../service/IconService";
import {unitService} from "../../../service/UnitService";
import TextNumberUtils from "../../../utils/TextNumberUtils";
import {Icon} from "react-native-elements";

type Props = {
  activity?: ActivityDto;
  rightIcon?: string;
  onButtonPressed?: () => void;
  iconColor?: string;
}

export default function ActivityItem(props: Props) {

  if(!props.activity) {
    return <></>
  } else {
    const actionDto: ActivityTypeDto = productService.getProductAction(props.activity.actionType);
    const iconPath = IconService.getIconByName(props.activity.product.definition.iconName)?.iconPath;
    const unitValue = props.activity.unitValue;
    const unit = unitValue ? unitService.getUnitNameForNumber(props.activity.product.definition.unitName, unitValue) : "";
    const unitValueStr = TextNumberUtils.convertNumberToString(unitValue);
    const iconColor = props.iconColor || COLORS.primary;

    return (
      <View style={styles.container}>
        <View style={styles.columnLeft}>
          <Image source={iconPath} style={{width: 35, height: 35}} />
        </View>
        <View style={styles.columnMiddle}>
          <View style={styles.titleRow}>
            <T1 style={styles.title}>{props.activity.product.definition.name}</T1>
            {props.activity.product.description !== "" &&
              <View style={styles.descriptionRow}>
                <T2> (</T2>
                <T2 style={styles.description} numberOfLines={1}>{props.activity.product.description}</T2>
                <T2>) </T2>
              </View>
            }
          </View>
          <View style={styles.contentRow}>
            <T3>
              {actionDto.descriptionDone}
              {actionDto.hasDescriptionDoneUnits && (": " + unitValueStr + " " + unit)}
            </T3>
          </View>
        </View>
        {props.onButtonPressed && props.rightIcon &&
          <View style={styles.columnRight}>
            <Icon reverse name={props.rightIcon} color={iconColor} size={18} onPress={props.onButtonPressed} />
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    height: 60,
    width: "100%",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  columnLeft: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  columnMiddle: {
    flex: 5,
    justifyContent: "center",
  },
  columnRight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  title: {
    fontWeight: "bold",
    color: COLORS.textTitle,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    fontStyle: "italic",
  },
  descriptionRow: {
    flexDirection: "row",
    flex: 1,
    marginRight: 10,
  }
})
