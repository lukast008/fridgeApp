import React, {useEffect, useState} from 'react'
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import TopHeader from "../../layout/TopHeader/TopHeader";
import {useAuth} from "../../../providers/AuthProvider";
import ButtonWithLabel from "../../layout/inputs/ButtonWithLabel";
import {useData} from "../../../providers/DataProvider";
import Share from 'react-native-share';
import {exportImportService} from "../../../service/ExportImportService";
import DocumentPicker from 'react-native-document-picker';
import ExportImportDto from "../../../dto/ExportImportDto";
import {usePopup} from "../../../providers/PopupProvider";
import LoadingIndicator from "../../layout/common/LoadingIndicator";
import {Card} from "react-native-elements";
import {T2} from "../../layout/Text/Text";
import {ScreenContainer} from "../../layout/common/Containers";
import {openLocalRealm} from "../../../database/realm";

const RNFS = require('react-native-fs');

const DataStats = (props: {data: ExportImportDto}) => {
  const { data } = props;
  const { t } = useDefaultTranslation('userData');
  return (
    <Card containerStyle={{borderRadius: 10, marginBottom: 10}}>
      <T2>{t("dataInfo.noCategories")} {data.productCategories.length}</T2>
      <T2>{t("dataInfo.noProductDefs")} {data.productDefs.length}</T2>
      <T2>{t("dataInfo.noProducts")} {data.products.length}</T2>
      <T2>{t("dataInfo.noActivities")} {data.activities.length}</T2>
    </Card>
  );
}

export default function UserDataScreen() {

  const { t } = useDefaultTranslation('userData');
  const { user } = useAuth();
  const { realm, deleteAllData, initProducts } = useData();
  const [ dataFromDb, setDataFromDb ] = useState<ExportImportDto>();
  const [ isLoading, setIsLoading ] = useState(false);
  const { openPopup, closePopup } = usePopup();

  useEffect(() => {
    if(realm && !realm.isClosed) exportImportService.prepareDataFromDb(realm).then(result => setDataFromDb(result));
  }, [realm]);

  async function exportDataFromDb() {
    if(!realm) return;
    const tempPath = RNFS.DocumentDirectoryPath + '/tempRealm.realm';
    const tempRealm = await openLocalRealm(tempPath);
    await exportImportService.copyRealmData(realm, tempRealm, null);

    await Share.open({
      title: t("exportContent.title"),
      message: t("exportContent.message"),
      url: "file://" + tempPath,
      subject: "fridgeApp.realm",
    });

    tempRealm.close();
  }

  const handleImportData = () => {
    openPopup({
      title: t("importDataPopup.title"),
      content: t("importDataPopup.content"),
      buttons: [
        {label: t("common:no"), onPress: closePopup},
        {label: t("common:yes"), onPress: importData},
      ]
    });
  }

  async function importData() {
    if(!realm) return;
    try {
      const res = await DocumentPicker.pick({ type: [DocumentPicker.types.allFiles] });
      setIsLoading(true);
      const tempPath = RNFS.DocumentDirectoryPath + '/tempRealm.realm';
      await RNFS.copyFile(res.fileCopyUri, tempPath);
      await deleteAllData();
      const tempRealm = await openLocalRealm(tempPath);
      await exportImportService.copyRealmData(tempRealm, realm, user);
      tempRealm.close();
      RNFS.unlink(tempPath).catch(() => console.log("error in unlinking file"));
      RNFS.scanFile(tempPath).catch(() => console.log("error in scanning file"));
      await initProducts();
      const newData = await exportImportService.prepareDataFromDb(realm);
      setDataFromDb(newData);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteAll() {
    try {
      openPopup({
        title: t("deleteDataPopup.title"),
        content: t("deleteDataPopup.content"),
        buttons: [
          {label: t("common:no"), onPress: closePopup},
          {label: t("common:yes"), onPress: () => {
            deleteAllData()
              .then(() => realm?.close())
              .then(() => initProducts());
          }},
        ]
      });
    } catch (e) {
      console.log("error occured: ", e);
    }
  }

  return (
    <ScreenContainer>
      <TopHeader title={t("header")} isMainScreen={false}/>
      {!!dataFromDb && !isLoading &&
        <>
          <DataStats data={dataFromDb} />
          <ButtonWithLabel label={t("export")} onPress={exportDataFromDb} />
          <ButtonWithLabel label={t("import")} onPress={handleImportData} />
          <ButtonWithLabel label={t("deleteAll")} onPress={deleteAll} />
        </>
      }
      {(!dataFromDb || isLoading) && <LoadingIndicator txt={t("loadingData")}/>}

    </ScreenContainer>
  );
}
