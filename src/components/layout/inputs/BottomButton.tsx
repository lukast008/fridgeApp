import React from 'react'
import {ActivityIndicator, StyleSheet, TouchableOpacity} from "react-native";
import {T2} from "../Text/Text";
import COLORS from "../../../../assets/colors";

type Props = {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  accessibilityLabel?: string;
}

export default function BottomButton(props: Props) {
  const bgColor = props.isDisabled ? COLORS.disabled : COLORS.primary;
  return (
    <TouchableOpacity
      disabled={props.isDisabled}
      onPress={props.onPress}
      style={[styles.button, {backgroundColor: bgColor}]}
      accessibilityLabel={props.accessibilityLabel}
    >
        {!props.isLoading && <T2 style={styles.label}>{props.label}</T2>}
        {props.isLoading && <ActivityIndicator size="large" color={COLORS.textLight} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    backgroundColor: COLORS.primary,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    height: 50,
    bottom: 10,
    left: 15,
    right: 15,
  },
  label: {
    color: COLORS.textLight
  },
});
