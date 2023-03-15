import React, {useState} from 'react'
import {StyleSheet, View, TouchableWithoutFeedback, TouchableHighlight} from 'react-native'
import Modal from 'react-native-modal'
import COLORS from '../../../../assets/colors';
import ProductDto from '../../../dto/Product/ProductDto';
import ButtonsGroup from './ButtonsGroup';
import ModalHeader from './ModalHeader';
import TextNumberUtils from '../../../utils/TextNumberUtils';
import {ProductActions} from "../../../data/productActionsData";
import OptionsForm from "./OptionsForm";
import useProductActionsProvider from "../../../providers/ProductActionsProvider";
import ActivityDto from "../../../dto/ActivityDto";

type Props = {
  isVisible: boolean;
  product: ProductDto;
  onActionPerformed: (activity: ActivityDto) => void;
  onBackDropPress: () => void;
  onEditPress: () => void;
  onAddPress: () => void;
  onProductSelected?: (productDefId: ObjectId) => void;
}

export default function ProductOptionsModal(props: Props) {

  const { consumeProduct, throwAwayProduct, deleteProduct } = useProductActionsProvider();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [actionType, setActionType] = useState("");

  function toggleConsumeForm() {
    setIsFormVisible(true);
    setActionType(ProductActions.CONSUME);
  }

  function toggleThrowAwayForm() {
    setIsFormVisible(true);
    setActionType(ProductActions.THROW_AWAY);
  }

  function backFromForm() {
    setIsFormVisible(false);
    setActionType("");
  }

  function confirmForm(unitValue: number, expirationDate: Date, actionDate: Date) {
    const unitValueNumber = TextNumberUtils.roundNumber(unitValue);
    const isValid = isUnitValueValid(unitValueNumber);
    let activity = null;
    if(actionType === ProductActions.CONSUME) {
      if(isValid) activity = consumeProduct(props.product, unitValueNumber, actionDate);
    } else if(actionType === ProductActions.THROW_AWAY) {
      if(isValid) activity = throwAwayProduct(props.product, unitValueNumber, actionDate);
    }
    if(activity) props.onActionPerformed(activity);
  }

  function handleOnDeletePress() {
    deleteProduct(props.product, new Date());
    props.onBackDropPress();
  }

  function isUnitValueValid(value: number) {
    return (value > 0 && value <= props.product.unitValue);
  }

  function renderButtons() {
    const { product, onEditPress, onAddPress } = props;
    if(!isFormVisible) {
      return(
        <View style={styles.container}>
          <ButtonsGroup
            onConsumePress={toggleConsumeForm}
            onThrowAwayPress={toggleThrowAwayForm}
            onEditPress={onEditPress}
            onDeletePress={handleOnDeletePress}
            onAddPress={onAddPress}
          />
        </View>
      )
    }
  }

  function renderForm() {
    if(isFormVisible) {
      return(
        <View style={styles.container}>
          <OptionsForm
            product={props.product}
            actionType={actionType}
            onBackPress={backFromForm}
            onSavePress={confirmForm}
          />
        </View>
      );
    }
  }

  function onHeaderPress(productDefId: ObjectId) {
    if(props.onProductSelected) props.onProductSelected(productDefId);
  }

  function render() {
    const { isVisible, onBackDropPress } = props;
    return (
      <Modal isVisible={isVisible} style={styles.modal} onBackdropPress={onBackDropPress} onBackButtonPress={onBackDropPress}>
        <TouchableWithoutFeedback>
          <View>
            <TouchableHighlight onPress={() => onHeaderPress(props.product.definition._id)}>
              <ModalHeader product={props.product} />
            </TouchableHighlight>
            {renderButtons()}
            {renderForm()}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  return render();
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: COLORS.background,
    margin: 0,
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  container: {
    padding: 10,
  },
})
