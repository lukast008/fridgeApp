import React, {useEffect, useRef} from 'react'
import {StyleSheet, TouchableWithoutFeedback, Animated} from 'react-native'
import COLORS from "../../../../assets/colors";
import ActivityDto from "../../../dto/ActivityDto";
import useProductActionsProvider from "../../../providers/ProductActionsProvider";
import ActivityItem from "../Activity/ActivityItem";

type Props = {
  activity?: ActivityDto;
  onPopupHidden: () => void;
}

export default function ActionConfirmationPopup(props: Props) {

  const posAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const timer = useRef<NodeJS.Timer | null>(null);
  const { undoActivity } = useProductActionsProvider();

  useEffect(() => {
    if(props.activity) {
      Animated.timing(posAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      if(timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        closePopup();
      }, 3000);
    }
    return () => {
      if(props.activity && timer.current) clearTimeout(timer.current);
    }
  }, [props.activity]);

  function closePopup() {
    Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => props.onPopupHidden());
  }

  function handleOnUndoAction() {
    if(props.activity) undoActivity(props.activity);
    closePopup();
  }

  const yVal = posAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  const animStyle = {
    opacity: fadeAnim,
    translateY: yVal
  };

  if(!props.activity) {
    return <></>
  } else {
    return (
      <TouchableWithoutFeedback onPress={closePopup}>
        <Animated.View style={[styles.container, animStyle]}>
          <ActivityItem activity={props.activity} rightIcon={"undo"} onButtonPressed={handleOnUndoAction} />
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    borderRadius: 0,
    padding: 10,
    elevation: 10,
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
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
})
