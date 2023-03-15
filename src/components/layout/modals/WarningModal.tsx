import React from 'react'
import Modal from "react-native-modal";
import {StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import {T2} from "../Text/Text";
import COLORS from "../../../../assets/colors";
import ButtonWithLabel from "../inputs/ButtonWithLabel";

type Props = {
  isVisible: boolean;
  txt: string;
  onDismiss: () => void;
}

export default function WarningModal(props: Props) {
  return (
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={props.onDismiss}
      onBackButtonPress={props.onDismiss}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'} >
      <TouchableWithoutFeedback>
        <View style={styles.modal}>
          <T2 style={styles.modalText}>{props.txt}</T2>
          <ButtonWithLabel label={"OK"} onPress={props.onDismiss} />
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
  modalText: {
    textAlign: "center",
    marginBottom: 5,
  }
})
