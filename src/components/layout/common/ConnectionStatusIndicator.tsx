import React from 'react';
import {StyleSheet, View} from "react-native";
import {T3} from "../Text/Text";
import COLORS from "../../../../assets/colors";
import ConnectionStatusDto, {ConnectionState} from "../../../dto/ConnectionStatusDto";
import DateUtils from "../../../utils/DateUtils";
import i18n from "../../../utils/TranslationsUtils";

type Props = {
  connectionStatus: ConnectionStatusDto;
  isVisible: boolean;
}

export default function ConnectionStatusIndicator(props: Props) {
  if(props.isVisible) {
    return (
      <View style={styles.container}>
        <View style={[styles.dot, {backgroundColor: getDotColor(props.connectionStatus.state)}]} />
        <T3 style={styles.text}>{getStatusTxt(props.connectionStatus.state)}</T3>
        <T3 style={styles.text}>({DateUtils.convertDateToTimeString(props.connectionStatus.lastSyncDate)})</T3>
      </View>
    );
  } else return <></>;
}

function getStatusTxt(state: ConnectionState) {
  if(state === ConnectionState.Connected) return i18n.t("settings:connection.connected");
  else if(state === ConnectionState.Connecting) return i18n.t("settings:connection.connecting");
  else return i18n.t("settings:connection.disconnected");
}

function getDotColor(state: ConnectionState) {
  if(state === ConnectionState.Connected) return COLORS.green;
  else if(state === ConnectionState.Connecting) return COLORS.yellow;
  else return COLORS.invalid;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    padding: 5,
    backgroundColor: COLORS.primary,
  },
  text: {
    marginLeft: 10,
    color: COLORS.textLight,
  },
  dot: {
    backgroundColor: COLORS.green,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 10,
  }
});
