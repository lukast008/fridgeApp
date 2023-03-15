import React from 'react'
import styled from "styled-components/native";
import LogDto from "../../../../dto/AppInfo/LogDto";
import {T2, T3, T4} from "../../Text/Text";
import COLORS from "../../../../../assets/colors";
import DateUtils from "../../../../utils/DateUtils";
import {View} from "react-native";

const Container = styled.View`
  padding: 10px;
  width: 100%;
`;

const LogLevel = styled(T2)<{bgColor: string}>`
  background-color: ${props => props.bgColor};
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  color: ${COLORS.textLight}
`;

const LogTimestamp = styled(T4)`
  text-align: center;
  padding: 5px;
`;

const LogSession = styled(T4)`
  padding: 2px;
  font-weight: bold;
`;

const LogMessageContainer = styled.ScrollView`
  max-height: 200px;
  margin-top: 5px;
  border: 2px solid ${COLORS.lightGray};
  border-radius: 5px;
`;

const LogMessage = styled(T3)`
  padding: 5px;
`;

type Props = {
  logDto: LogDto;
}

export default function LogDetailsModal({ logDto }: Props) {
  return (
    <Container>
      <LogLevel bgColor={logDto.color}>{logDto.level}</LogLevel>
      <LogTimestamp>[{logDto.context}] {DateUtils.convertDateToDateTimeString(logDto.timestamp)}</LogTimestamp>
      <LogSession>{logDto.sessionId}</LogSession>
      <LogMessageContainer>
        <View onStartShouldSetResponder={() => true}>
          <LogMessage>{logDto.message}</LogMessage>
        </View>
      </LogMessageContainer>
    </Container>
  );
}
