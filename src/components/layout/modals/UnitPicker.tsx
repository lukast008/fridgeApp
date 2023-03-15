import React, {useState} from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native'
import Modal from 'react-native-modal';
import {unitService} from '../../../service/UnitService';
import UnitDto from '../../../dto/UnitDto';
import COLORS from '../../../../assets/colors';
import UnitIcon from '../Icons/UnitIcon';
import { T2, T3 } from '../Text/Text';
import {Icon} from "react-native-elements";

type Props = {
  selectedUnit: UnitDto,
  unitValue: number,
  onUnitSelected: (unitName: string) => void;
  enabled?: boolean;
}

export default function(props: Props) {

  const [isListVisible, setIsListVisible] = useState(false);

  function toggleList() {
    setIsListVisible(!isListVisible);
  }

  function handleUnitPress(selectedUnit: UnitDto) {
    setIsListVisible(false);
    props.onUnitSelected(selectedUnit.name);
  }

  function renderList() {
    return(
      <Modal
        isVisible={isListVisible}
        onBackdropPress={toggleList}
        onBackButtonPress={toggleList}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}>
        <View style={styles.modalStyle}>
          <FlatList
              data={unitService.getAllUnits()}
              keyExtractor={(item) => item.name}
              numColumns={1}
              renderItem={({item}) => renderUnitOnList(item)}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
            />
        </View>
      </Modal>
    );
  }

  function renderUnitOnList(selectedUnit: UnitDto) {
    return (
      <TouchableOpacity onPress={() => handleUnitPress(selectedUnit)}>
        <View style={styles.item}>
          <UnitIcon name={selectedUnit.iconName} />
          <T2>{selectedUnit.nameIf1}</T2>
        </View>
      </TouchableOpacity>
    );
  }

  const unitName = unitService.getUnitNameForNumber(props.selectedUnit.name, props.unitValue);

  if(props.enabled) {
    return (
      <View>
        <TouchableOpacity style={styles.row} onPress={toggleList} hitSlop={{top: 5, bottom: 10, left: 20, right: 20}}>
          <T3 style={{fontSize: 17}}>{unitName}</T3>
          <Icon name={"expand-more"} color={COLORS.textDark} size={18} />
        </TouchableOpacity>
        {renderList()}
      </View>
    )
  } else {
    return (
      <View>
        <View style={styles.row}>
          <T3 style={{fontSize: 17}}>{unitName}</T3>
        </View>
        {renderList()}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  list: {
    backgroundColor: "#00ff00ee",
    width: 100,
    height: 200,
    position: "absolute",
    zIndex: 10,
    elevation: 10,
    marginTop: -210,
  },
  modalStyle: {
    maxHeight: "50%",
    borderRadius: 10,
    backgroundColor: COLORS.background,
    width: 200,
    alignSelf: "center"
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  itemText: {
    marginLeft: 10,
  },
  itemIcon: {
    marginLeft: 5,
    marginRight: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
  },
})
