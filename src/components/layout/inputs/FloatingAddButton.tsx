import React from 'react'
import {StyleSheet} from "react-native";
import COLORS from "../../../../assets/colors";
import {Icon} from "react-native-elements";

type Props = {
  onPress: () => void;
  accessibilityLabel?: string;
}

export default function FloatingAddButton(props: Props) {
  return (
    <Icon
      reverse
      name='add'
      color={COLORS.primary}
      size={26}
      containerStyle={styles.button}
      onPress={props.onPress}
      accessibilityLabel={props.accessibilityLabel}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 20,
    right: 15,
  },
});
