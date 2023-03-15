import React from 'react'
import {ActivityIndicator, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {T2} from "../Text/Text";
import COLORS from "../../../../assets/colors";

type Props = {
  label: string;
  onPress: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export default function ButtonWithLabel(props: Props) {
  const bgColor = props.isDisabled ? COLORS.disabled : COLORS.primary;
  return (
    <TouchableOpacity disabled={props.isDisabled} onPress={props.onPress} style={[styles.button, {backgroundColor: bgColor}]}>
      {!props.isLoading && <T2 style={styles.label}>{props.label}</T2>}
      {props.isLoading && <ActivityIndicator size="large" color={COLORS.textLight} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    height: 40,
    minWidth: 100,
  },
  label: {
    color: COLORS.textLight
  },
});
