import React, {useState} from 'react'
import { StyleSheet, Image, TouchableOpacity, View, FlatList } from 'react-native'
import IconDto from '../../../dto/IconDto'
import Modal from 'react-native-modal';
import IconService from '../../../service/IconService'
import COLORS from '../../../../assets/colors';
import {Icon} from "react-native-elements";

type Props = {
  selectedIcon: IconDto;
  onIconSelected: (icon: IconDto) => void;
  enabled?: boolean;
}

export default function IconPicker(props: Props) {

  const [isIconsListVisible, setIsIconsListVisible] = useState(false);

  function toggleIconsList() {
    setIsIconsListVisible(!isIconsListVisible);
  }

  function handleIconPress(icon: IconDto) {
    setIsIconsListVisible(false);
    props.onIconSelected(icon);
  }

  function renderSelectedIcon() {
    return (
      <>
        <Image source={props.selectedIcon.iconPath} style={{width: 40, height: 40}} />
        {props.enabled && <Icon name={"expand-more"} color={COLORS.textDark} size={22} containerStyle={styles.arrowIconStyle}/>}
      </>
    );
  }

  function renderListOfIcons() {
    return(
      <Modal
        isVisible={isIconsListVisible}
        onBackdropPress={toggleIconsList}
        onBackButtonPress={toggleIconsList}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'} >
        <View style={styles.modalStyle}>
          <FlatList
            data={IconService.getAllIcons()}
            keyExtractor={(item) => item.name}
            numColumns={4}
            renderItem={({item}) => renderIconOnList(item)}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
          />
        </View>
      </Modal>
    );
  }

  function renderIconOnList(selectedIcon: IconDto) {
    return (
      <TouchableOpacity onPress={() => handleIconPress(selectedIcon)}>
        <Image source={selectedIcon.iconPath} style={{width: 50, height: 50, margin: 10}} />
      </TouchableOpacity>
    );
  }

  if(props.enabled) {
    return (
      <TouchableOpacity onPress={toggleIconsList}>
        {renderSelectedIcon()}
        {renderListOfIcons()}
      </TouchableOpacity>
    );
  } else {
    return (
      <View>
        {renderSelectedIcon()}
        {renderListOfIcons()}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  modalStyle: {
    height: "50%",
    borderRadius: 10,
    backgroundColor: COLORS.background,
    width: 300,
    alignSelf: "center",
    alignItems: "center",
  },
  arrowIconStyle: {
    position: "absolute",
    bottom: -5,
    right: -5,
    transform: [{rotate: '-45deg'}],
  }
})
