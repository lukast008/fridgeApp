import React, {useState} from 'react'
import Modal from "react-native-modal";
import {StyleSheet, Switch, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {T3} from "../Text/Text";
import COLORS from "../../../../assets/colors";
import ButtonWithLabel from "../inputs/ButtonWithLabel";
import {useData} from "../../../providers/DataProvider";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";

type Props = {
  isVisible: boolean;
  onDismiss: () => void;
}

export default function ProductListSettingsModal(props: Props) {
  const { t } = useDefaultTranslation('product');
  const { localStateProvider } = useData();

  const toggleState = () => {
    localStateProvider.setGroupProductsWithCategories(!localStateProvider.groupProductsWithCategories);
  }

  return (
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={props.onDismiss}
      onBackButtonPress={props.onDismiss}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'} >
      <TouchableWithoutFeedback>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.row} onPress={toggleState}>
            <T3>{t("groupByCategory")}</T3>
            <Switch
              trackColor={{ false: COLORS.lightGray, true: COLORS.primaryTransparent }}
              thumbColor={localStateProvider.groupProductsWithCategories ? COLORS.primary : COLORS.lightGray}
              onValueChange={toggleState}
              value={localStateProvider.groupProductsWithCategories}
            />
          </TouchableOpacity>
          <ButtonWithLabel label={t("common:ok")} onPress={props.onDismiss} />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.primary,
    borderWidth: 3,
    borderRadius: 15,
    padding: 10,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  }
})
