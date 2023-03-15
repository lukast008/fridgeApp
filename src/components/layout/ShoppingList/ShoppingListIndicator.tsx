import React, {useEffect, useMemo, useRef, useState} from 'react'
import COLORS from "../../../../assets/colors";
import {Icon} from "react-native-elements";
import styled from "styled-components/native";
import {T3} from "../Text/Text";
import {Animated} from "react-native";
import {useData} from "../../../providers/DataProvider";

type Props = {
  title: string;
  isOnList: boolean;
}

const Container = styled.View`
  position: absolute;
  top: -15px;
  right: -15px;
  flex-direction: row;
  align-items: center;
`;

const Label = styled(T3)`
  background-color: ${COLORS.primary};
  border-radius: 15px;
  padding: 4px 20px 4px 10px;
  margin-right: -25px;
  color: ${COLORS.textLight};
`;

export default function ShoppingListIndicator(props: Props) {

  const { shoppingListProvider } = useData();
  const { saveItem, deleteItemByTitle } = shoppingListProvider;
  const [isItemOnList, setIsItemOnList] = useState(props.isOnList);

  const labelAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => setIsItemOnList(props.isOnList), [props.isOnList]);
  const color = useMemo(() => isItemOnList ? COLORS.primary : COLORS.disabled, [isItemOnList]);
  const labelTxt = useMemo(() => isItemOnList ? "Dodano do listy zakupów" : "Usunięto z listy zakupów", [isItemOnList]);

  const handlePress = () => {
    Animated.timing(labelAnim, { toValue: 1, duration: 2000, useNativeDriver: true }).start(() => labelAnim.setValue(0));
    setIsItemOnList(!isItemOnList);
    setTimeout(() => {
      if (!props.isOnList) {
        saveItem(props.title);
      } else {
        deleteItemByTitle(props.title);
      }
    }, 100);
  }

  const scaleVal = labelAnim.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1, 1, 0],
  });

  const posXVal = labelAnim.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [120, 0, 0, 120],
  });

  const spin = labelAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '180deg', '360deg']
  })

  return (
    <Container>
      <Animated.View style={{scaleX: scaleVal, translateX: posXVal}}>
        <Label style={{backgroundColor: color}}>{labelTxt}</Label>
      </Animated.View>
      <Animated.View style={{transform: [{rotate: spin}]}}>
        <Icon reverse name='shopping-basket' color={color} size={17} onPress={handlePress}/>
      </Animated.View>
    </Container>
  );
}
