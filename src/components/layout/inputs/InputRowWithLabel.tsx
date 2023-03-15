import React from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import COLORS from "../../../../assets/colors";
import {T4} from "../Text/Text";

type Props = {
  label: string;
  children: any;
  onPress?: () => void;
}

export default function InputRowWithLabel(props: Props) {

  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress} disabled={!props.onPress}>
      <T4 style={styles.label}>{props.label}</T4>
      <View style={styles.rowContainer}>
        {props.children}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 80,
    backgroundColor: COLORS.background,
    borderBottomWidth: 2,
    borderColor: COLORS.border,
    marginTop: 5,
    marginHorizontal: 5,
    borderWidth: 2,
    borderRadius: 10,
    display: "flex",
    flex: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 10,
    alignItems: "center",
  },
  label: {
    paddingHorizontal: 10,
    color: COLORS.border,
    backgroundColor: COLORS.textLight,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.border,
    position: "absolute",
    top: -10,
    left: 20,
  }
});
