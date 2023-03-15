import React from 'react';
import {ActivityIndicator, StyleSheet, View} from "react-native";
import {T2} from "../Text/Text";
import COLORS from "../../../../assets/colors";

type Props = {
  txt: string;
}

export default function LoadingIndicator(props: Props) {
  return (
    <View style={styles.container}>
      <T2 style={styles.text}>{props.txt}</T2>
      <ActivityIndicator size={"large"} color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: "center",
  },
  text: {
    marginBottom: 10,
  }
});
