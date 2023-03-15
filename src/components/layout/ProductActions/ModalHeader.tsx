import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import COLORS from '../../../../assets/colors'
import DateUtils from '../../../utils/DateUtils'
import TextNumberUtils from '../../../utils/TextNumberUtils'
import ProductDto from '../../../dto/Product/ProductDto'
import {unitService} from '../../../service/UnitService'
import IconService from '../../../service/IconService'
import { H2 } from '../Text/Header'
import {T2, T4} from '../Text/Text'
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";

type Props = {
  product: ProductDto;
}

export default function ModalHeader(props: Props) {

  const { t } = useDefaultTranslation('dates');
  const { product } = props;
  const iconPath = IconService.getIconByName(product.definition.iconName)?.iconPath;
  const unitStr = TextNumberUtils.convertNumberToString(product.unitValue) + " " + unitService.getUnitNameForNumber(product.definition.unitName, product.unitValue);

  function renderDescription() {
    if(product.description) {
      return <T2 style={styles.description}>({product.description})</T2>
    }
  }

  function renderDate(label: string, date?: Date) {
    if(date) {
      return <T4 style={styles.dateInfo}>{label} {DateUtils.convertDateToRelativeTime(date)}</T4>
    }
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection: "row"}}>
        <View style={styles.columnLeft}>
          <Image source={iconPath} style={{width: 50, height: 50}} />
        </View>
        <View style={styles.columnRight}>
          <View style={{flexDirection: "row", alignItems: "center", flexWrap: "wrap"}}>
            <H2 style={styles.title}>{product.definition.name}</H2>
            {renderDescription()}
          </View>
          <View style={{flexDirection: "row"}}>
            <T2>{unitStr}</T2>
            <T2 style={[styles.expirationDateText, {color: DateUtils.getExpirationDateColor(product.expirationDate)}]}>
              {DateUtils.convertDateToString(product.expirationDate)}
            </T2>
          </View>
          {renderDate(t("added"), product.creationDate)}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderColor: COLORS.primary,
    borderBottomWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    color: COLORS.textTitle,
  },
  columnLeft: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  columnRight: {
    flex: 5,
    marginLeft: 10,
    justifyContent: "center",
  },
  expirationDateText: {
    textAlign: "right",
    flex: 1
  },
  description: {
    margin: 5,
    flex: 1,
    fontStyle: "italic",
  },
  dateInfo: {
    marginTop: 5
  }
})
