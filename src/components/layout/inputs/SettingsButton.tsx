import React from 'react'
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {T2} from "../Text/Text";
import COLORS from "../../../../assets/colors";
import {Icon} from "react-native-elements";

type Props = {
  label: string;
  onPress?: () => void;
}

export default function SettingsButton(props: Props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.button}>
        <T2 style={styles.label}>{props.label}</T2>
        <Icon name='keyboard-arrow-right' color={COLORS.border} size={35} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    height: 60,
  },
  label: {
    color: COLORS.textTitle,
    flex: 1,
  }
});
