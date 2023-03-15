import React from 'react'
import { StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native'
import { Icon } from 'react-native-elements';
import COLORS from '../../../../assets/colors';
import { T2 } from '../Text/Text';

type Props = {
  label: string,
  icon: string,
  onPress: () => void;
  buttonStyles?: StyleProp<ViewStyle>;
  isDisabled?: boolean;
}

export default function OptionsButton(props: Props) {

  const { label, icon, onPress, isDisabled, buttonStyles } = props;
  const disabledStyle = isDisabled ? {backgroundColor: COLORS.disabled} : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.container, buttonStyles, disabledStyle]}>
      <Icon name={icon} color={COLORS.background} size={25} iconStyle={styles.icon}/>
      <T2 style={styles.label}>{label}</T2>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: COLORS.primary,
    margin: 5,
    borderRadius: 5,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    height: 50,
  },
  label: {
    color: COLORS.textLight,
    flex: 1,
  },
  icon: {
    marginLeft: 5,
    marginRight: 5,
  },
})
