import React, {useEffect, useState} from 'react'
import {Keyboard} from 'react-native'
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import TopHeader from "../../layout/TopHeader/TopHeader";
import {useAuth} from "../../../providers/AuthProvider";
import {T2} from "../../layout/Text/Text";
import ButtonWithLabel from "../../layout/inputs/ButtonWithLabel";
import {useData} from "../../../providers/DataProvider";
import {useNavigation} from "@react-navigation/native";
import styled from "styled-components/native";
import FormTextInput from "../../layout/inputs/FormTextInput";
import {Screens} from "../../../navigation/Screens";
import {BottomWrapper, ScreenContainer} from "../../layout/common/Containers";
import {usePopup} from "../../../providers/PopupProvider";
import LoadingIndicator from "../../layout/common/LoadingIndicator";
import {openLocalRealm, openRealm} from "../../../database/realm";
import {exportImportService} from "../../../service/ExportImportService";

const InfoText = styled(T2)`
  margin: 10px 15px;
  text-align: center;
`;

const UserIdText = styled(T2)`
  margin: 0 15px 10px 15px;
  font-weight: bold;
  text-align: center;
`;

export default function MyProfileScreen() {

  const { t } = useDefaultTranslation('myProfile');
  const { user, logIn, logOut } = useAuth();
  const { products, realm, deleteAllData, clearDataState, localStateProvider } = useData();
  const { currentUserEmail, setCurrentUserEmail } = localStateProvider;
  const [ isLoginInProgress, setIsLoginInProgress ] = useState(false);
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ hasLocalDataToCopy, setHasLocalDataToCopy] = useState(false);
  const navigation = useNavigation();
  const { openPopup, closePopup } = usePopup();

  useEffect(() => {
    if(!user && products && products.length > 0) setHasLocalDataToCopy(true);
  }, [products, user]);

  useEffect(() => {
    if(realm && user && products !== null && hasLocalDataToCopy) {
      setHasLocalDataToCopy(false);
      openPopup({
        title: t("copyLocalDataPopup.title"),
        content: t("copyLocalDataPopup.content"),
        buttons: [
          {label: t("common:no")},
          {label: t("common:yes"), onPress: () => copyLocalData().then(() => closePopup())},
        ]
      });
    }
  }, [user, products, hasLocalDataToCopy]);

  const copyLocalData = async () => {
    const syncRealm = await openRealm(user);
    if(!syncRealm) return;
    await deleteAllData();
    const localRelm = await openLocalRealm();
    await exportImportService.copyRealmData(localRelm, syncRealm, user);
  }

  function handleLogin() {
    setIsLoginInProgress(true);
    Keyboard.dismiss();

    logIn(email, password).then(user => {
      clearDataState();
      setEmail("");
      setPassword("");
      setCurrentUserEmail(user.profile.email);
    }).catch(() => {
      openPopup({
        title: t("loginFailed.title"),
        content: t("loginFailed.content"),
        buttons: [{label: t("common:tryAgain"), onPress: closePopup}]
      });
    }).finally(() => {
      setIsLoginInProgress(false);
    });
  }

  function handleLogout() {
    clearDataState();
    setCurrentUserEmail(undefined);
    logOut();
  }

  const renderUserView = () => {
    return user ? renderViewIfLoggedIn() : renderViewIfNotLoggedIn();
  }

  function renderViewIfNotLoggedIn() {
    return (
      <>
        <InfoText>{t("loginInfo")}</InfoText>
        <FormTextInput type={'email'} value={email} onValueChanged={setEmail} />
        <FormTextInput type={'password'} value={password} onValueChanged={setPassword} />
        <ButtonWithLabel label={t("login")} onPress={handleLogin} isLoading={isLoginInProgress} isDisabled={!email || !password} />
        <BottomWrapper>
          <InfoText>{t("doNotHaveAccount")}</InfoText>
          <ButtonWithLabel label={t("signup")} onPress={() => navigation.navigate(Screens.SIGNUP_SCREEN)} />
        </BottomWrapper>
      </>
    )
  }

  function renderViewIfLoggedIn() {
    if(products == null) return <LoadingIndicator txt={""} />
    return (
      <>
        <InfoText>{t("loggedAsInfo")}</InfoText>
        <UserIdText>{!!currentUserEmail && currentUserEmail} ({user?.id})</UserIdText>
        <ButtonWithLabel label={t("logout")} onPress={handleLogout} />
      </>
    )
  }

  return (
    <ScreenContainer>
      <TopHeader title={t("header")} isMainScreen={false}/>
      {renderUserView()}
    </ScreenContainer>
  );
}
