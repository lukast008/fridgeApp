import React, { useState } from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import { Icon } from 'react-native-elements'
import COLORS from '../../../../assets/colors'
import { T1 } from '../Text/Text'
import FilterPanel from './FilterPanel'
import DateFilterDto from "../../../dto/DateFilterDto";
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import {useNavigation} from "@react-navigation/native";

type Props = {
  title: string;
  isMainScreen: boolean;
  onSearchChange?: (txt: string) => void;
  onAddPress?: () => void;
  onSavePress?: () => void;
  onEditPress?: () => void;
  onSettingsPress?: () => void;
  onHelpPress?: () => void;
  onClearPress?: () => void;
  onSharePress?: () => void;
  hasFilterPanel?: boolean;
  onFilterPressLeft?: () => void;
  onFilterPressRight?: () => void;
  dateFilterData?: DateFilterDto;
  onFilterRangeChanged?: (id: string) => void;
}

export default function TopHeader(props: Props) {

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const navigation = useNavigation();
  const { t } = useDefaultTranslation('common');

  function toggleSearchMode() {
    setIsSearchMode(!isSearchMode);
    handleClearSearch();
  }

  function handleClearSearch() {
    handleSearchChange("");
  }

  function handleSearchChange(txt: string) {
    setSearchValue(txt)
    if(props.onSearchChange) props.onSearchChange(txt);
  }

  function renderFiltersPanel() {
    const { hasFilterPanel, onFilterPressLeft, onFilterPressRight, dateFilterData, onFilterRangeChanged} = props;
    if(hasFilterPanel) {
      return(
        <FilterPanel
          onPressLeft={onFilterPressLeft}
          onPressRight={onFilterPressRight}
          dateFilter={dateFilterData}
          onFilterChanged={onFilterRangeChanged}
        />
      );
    }
  }

  function renderSearchButton() {
    if(props.onSearchChange) {
      return <Icon name='search' color={COLORS.textLight} size={35} iconStyle={styles.button} onPress={toggleSearchMode}/>;
    }
  }

  function renderAddButton() {
    if(props.onAddPress) {
      return <Icon name='add' color={COLORS.textLight} size={40} iconStyle={styles.button} onPress={props.onAddPress}/>;
    }
  }

  function renderSaveButton() {
    if(props.onSavePress) {
      return <Icon name='save' color={COLORS.textLight} size={35} iconStyle={styles.button} onPress={props.onSavePress}/>;
    }
  }

  function renderEditButton() {
    if(props.onEditPress) {
      return <Icon name='edit' color={COLORS.textLight} size={30} iconStyle={styles.button} onPress={props.onEditPress}/>;
    }
  }

  function renderSettingsButton() {
    if(props.onSettingsPress) {
      return <Icon name='filter-list' color={COLORS.textLight} size={30} iconStyle={styles.button} onPress={props.onSettingsPress}/>;
    }
  }

  function renderHelpButton() {
    if(props.onHelpPress) {
      return <Icon name='help-outline' color={COLORS.textLight} size={30} iconStyle={styles.button} onPress={props.onHelpPress}/>;
    }
  }

  function renderClearButton() {
    if(props.onClearPress) {
      return <Icon name='delete' color={COLORS.textLight} size={30} iconStyle={styles.button} onPress={props.onClearPress}/>;
    }
  }

  function renderShareButton() {
    if(props.onSharePress) {
      return <Icon name='file-upload' color={COLORS.textLight} size={30} iconStyle={styles.button} onPress={props.onSharePress}/>;
    }
  }

  function renderMenuButton() {
    if(!props.isMainScreen) {
      return <Icon name='arrow-back' color={COLORS.textLight} size={35} iconStyle={styles.button} onPress={() => navigation.goBack()}/>
    }
  }

  function renderInSearchMode() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Icon name='arrow-back' color={COLORS.textLight} size={35} iconStyle={styles.button} onPress={toggleSearchMode}/>
          <TextInput
            style={styles.input}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={COLORS.border}
            autoFocus={true}
            onChangeText={handleSearchChange}
            value={searchValue}
          />
          <Icon name='close' color={COLORS.textLight} size={35} iconStyle={styles.button} onPress={handleClearSearch}/>
        </View>
        {renderFiltersPanel()}
      </View>
    )
  }

  function renderInDefaultMode() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          {renderMenuButton()}
          <T1 style={styles.title} numberOfLines={1}>{props.title}</T1>
          {renderSearchButton()}
          {renderAddButton()}
          {renderSaveButton()}
          {renderEditButton()}
          {renderSettingsButton()}
          {renderHelpButton()}
          {renderClearButton()}
          {renderShareButton()}
        </View>
        {renderFiltersPanel()}
      </View>
    )
  }

  return isSearchMode ? renderInSearchMode() : renderInDefaultMode();
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    padding: 10,
    elevation: 10,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: COLORS.textLight,
    flex: 1,
    marginLeft: 10,
    height: 40,
    textAlignVertical: "center",
    marginRight: 10,
    paddingRight: 5,
  },
  input: {
    fontSize: 24,
    color: COLORS.textLight,
    flex: 1,
    marginLeft: 10,
    height: 40,
    lineHeight: 40,
    padding: 0,
  },
  button: {
    marginLeft: 5,
    marginRight: 5,
  },
  filterPanel: {
    backgroundColor: "green",
    height: 40,
    width: "100%",
  }
})
