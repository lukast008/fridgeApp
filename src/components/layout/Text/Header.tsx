import React from 'react'
import { Text, TextStyle, StyleProp } from 'react-native'

type Props = {
  style?: StyleProp<TextStyle>;
  children: any;
}

export function H1(props:Props) {
    return <Text style={[{fontSize: 26, fontWeight: "bold"}, props.style]}>{props.children}</Text>
}

export function H2(props:Props) {
  return <Text style={[{fontSize: 24, fontWeight: "bold"}, props.style]}>{props.children}</Text>
}

export function H3(props:Props) {
  return <Text style={[{fontSize: 22, fontWeight: "bold"}, props.style]}>{props.children}</Text>
}
