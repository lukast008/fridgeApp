import React, {ReactElement} from 'react'
import Modal from 'react-native-modal';
import COLORS from '../../../../assets/colors';
import {T1} from "../Text/Text";
import styled from "styled-components/native";

const Container = styled.View`
  border-radius: 10px;
  padding: 2px;
  background-color: ${COLORS.primary};
  width: 300px;
  align-self: center;
  align-items: center;
`;

const Title = styled(T1)`
  justify-content: center;
  align-items: center;
  padding: 5px;
  text-align: center;
  color: ${COLORS.background};
`;

type Props = {
  isVisible: boolean;
  onBackdropPress: () => void;
  title?: string;
  children: ReactElement;
}

export default function GenericModal(props: Props) {
  return(
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={props.onBackdropPress}
      onBackButtonPress={props.onBackdropPress}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}>
      <Container>
        {props.title && <Title>{props.title}</Title>}
        {props.children}
      </Container>
    </Modal>
  );
}
