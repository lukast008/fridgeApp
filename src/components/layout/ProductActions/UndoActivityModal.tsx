import React from 'react'
import {StyleSheet, TouchableWithoutFeedback} from 'react-native'
import Modal from 'react-native-modal'
import COLORS from '../../../../assets/colors';
import useProductActionsProvider from "../../../providers/ProductActionsProvider";
import ActivityDto from "../../../dto/ActivityDto";
import ActivityItem from "../Activity/ActivityItem";
import {useData} from "../../../providers/DataProvider";
import {ProductActions} from "../../../data/productActionsData";

type Props = {
  activity?: ActivityDto;
  onBackDropPress: () => void;
}

export default function UndoActivityModal(props: Props) {

  const { getActivitiesForProduct } = useData();
  const { undoActivity, deleteProduct } = useProductActionsProvider();

  function onUndo() {
    if(props.activity) {
      undoActivity(props.activity);
    }
    props.onBackDropPress();
  }

  function onDelete() {
    if(props.activity) {
      deleteProduct(props.activity.product, new Date());
    }
    props.onBackDropPress();
  }

  function shouldBeDeleted(activity: ActivityDto) {
    return activity.actionType === ProductActions.ADD && getActivitiesForProduct(activity.product._id).length > 1;
  }

  function render() {
    const { activity, onBackDropPress } = props;
    const isVisible = activity !== undefined;
    if(activity) {
      let icon, iconColor, onButtonPress;
      if(shouldBeDeleted(activity)) {
        icon = "block";
        iconColor = COLORS.invalid;
        onButtonPress = onDelete;
      } else {
        icon = "undo";
        iconColor = COLORS.primary;
        onButtonPress = onUndo;
      }
      return (
        <Modal isVisible={isVisible} style={styles.modal} onBackdropPress={onBackDropPress} onBackButtonPress={onBackDropPress}>
          <TouchableWithoutFeedback>
            <ActivityItem activity={props.activity} rightIcon={icon} iconColor={iconColor} onButtonPressed={onButtonPress} />
          </TouchableWithoutFeedback>
        </Modal>
      )
    } else return <></>;
  }

  return render();
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: COLORS.background,
    margin: 0,
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
})
