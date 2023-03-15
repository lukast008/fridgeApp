import React, {useContext, useState} from 'react'
import styled from "styled-components/native";
import COLORS from "../../assets/colors";
import {TouchableHighlight, TouchableWithoutFeedback} from "react-native";
import {T1, T2} from "../components/layout/Text/Text";
import ButtonWithLabel from "../components/layout/inputs/ButtonWithLabel";

const Container = styled(TouchableHighlight)`
  background-color: ${COLORS.backgroundTransparent};
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PopupContainer = styled.View`
  width: 80%;
  min-height: 100px;
  max-height: 75%;
  border-radius: 10px;
  background-color: ${COLORS.background};
`;

const Title = styled(T1)`
  text-align: center;
  font-weight: bold;
  margin: 5px 0;
  padding: 5px;
  border-color: ${COLORS.primary};
  border-bottom-width: 2px;
`;

const Content = styled(T2)`
  text-align: center;
  padding: 5px;
`;

const ButtonsContainer = styled.View`
  display: flex;
  padding: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

export interface PopupButtonDto {
  label: string;
  onPress?: () => void;
}

export interface PopupDto {
  title?: string;
  content: string | Element;
  buttons: PopupButtonDto[];
  closeOnDismiss?: boolean;
}

type PopupContextType = {
  openPopup: (popupDto: PopupDto) => void;
  closePopup: () => void;
}

const PopupContext = React.createContext<PopupContextType | null>(null);

export default function PopupProvider({children}: any) {

  const [isVisible, setIsVisible] = useState(true);
  const [popupData, setPopupData] = useState<PopupDto>();

  const openPopup = (popupDto: PopupDto) => {
    setIsVisible(true);
    setPopupData(popupDto);
  }

  const closePopup = () => setIsVisible(false);

  const handleBackgroundPress = () => popupData?.closeOnDismiss && setIsVisible(false);

  const handleButtonPress = (callback?: () => void) => {
    closePopup();
    if(callback) callback();
  }

  return (
    <PopupContext.Provider value={{ openPopup, closePopup }}>
      {children}
      {isVisible && popupData &&
       <Container onPress={handleBackgroundPress} underlayColor={'none'}>
         <TouchableWithoutFeedback>
           <PopupContainer>
             { popupData.title && <Title>{popupData.title}</Title> }
             {typeof popupData.content === "string" &&
               <Content>{popupData.content}</Content>
             }
             {typeof popupData.content !== "string" &&
               popupData.content
             }
             <ButtonsContainer>
               {popupData.buttons.map(button =>
                 <ButtonWithLabel
                   key={button.label}
                   label={button.label}
                   onPress={() => handleButtonPress(button.onPress)} />
               )}
             </ButtonsContainer>
           </PopupContainer>
         </TouchableWithoutFeedback>
        </Container>
      }
    </PopupContext.Provider>
  );
}

const usePopup = () => {
  const popupContext = useContext(PopupContext);
  if(popupContext == null) {
    throw new Error("usePopup() called outside of an PopupProvider?");
  }
  return popupContext;
}

export {PopupProvider, usePopup};
