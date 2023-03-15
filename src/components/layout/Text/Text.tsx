import React from 'react'
import { Text, TextStyle, StyleProp, GestureResponderEvent } from 'react-native'

type Props = {
  style?: StyleProp<TextStyle>;
  onPress?: (event: GestureResponderEvent) => void;
  children?: any;
  numberOfLines?: number;
  accessibilityLabel?: string;
}

export function T1(props:Props) {
  return <Text style={[{fontSize: 20}, props.style]} onPress={props.onPress} numberOfLines={props.numberOfLines} accessibilityLabel={props.accessibilityLabel}>{props.children}</Text>
}

export function T2(props:Props) {
  return <Text style={[{fontSize: 18}, props.style]} onPress={props.onPress} numberOfLines={props.numberOfLines} accessibilityLabel={props.accessibilityLabel}>{props.children}</Text>
}

export function T3(props:Props) {
  return <Text style={[{fontSize: 16}, props.style]} onPress={props.onPress} numberOfLines={props.numberOfLines} accessibilityLabel={props.accessibilityLabel}>{props.children}</Text>
}

export function T4(props:Props) {
  return <Text style={[{fontSize: 14}, props.style]} onPress={props.onPress} numberOfLines={props.numberOfLines} accessibilityLabel={props.accessibilityLabel}>{props.children}</Text>
}
