import React from 'react'
import { StyleSheet, View } from 'react-native'
import OptionsButton from './OptionsButton'
import {productService} from "../../../service/ProductService";
import {ProductActions} from "../../../data/productActionsData";

type Props = {
  onConsumePress: () => void;
  onThrowAwayPress: () => void;
  onAddPress: () => void;
  onEditPress?: () => void;
  onDeletePress: () => void;
}

export default function ButtonsGroup(props:Props) {

  function onPress(actionType: string) {
    if(actionType === ProductActions.ADD) props.onAddPress();
    if(actionType === ProductActions.EDIT && props.onEditPress) props.onEditPress();
    if(actionType === ProductActions.DELETE) props.onDeletePress();
    if(actionType === ProductActions.CONSUME) props.onConsumePress();
    if(actionType === ProductActions.THROW_AWAY) props.onThrowAwayPress();
  }

  function renderButton(actionType: string) {
    const actionDto = productService.getProductAction(actionType);
    return(
        <OptionsButton
          label={actionDto.label}
          icon={actionDto.iconName}
          onPress={() => onPress(actionType)}
          buttonStyles={{backgroundColor: actionDto.buttonColor}}/>
    );
  }

  return (
    <View>
      <View style={styles.buttonsRow}>
        {renderButton(ProductActions.CONSUME)}
        {renderButton(ProductActions.THROW_AWAY)}
      </View>
      <View style={styles.buttonsRow}>
        {renderButton(ProductActions.ADD)}
      </View>
      <View style={styles.buttonsRow}>
        {renderButton(ProductActions.EDIT)}
        {renderButton(ProductActions.DELETE)}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonsRow: {
    flexDirection: "row",
  },
})
