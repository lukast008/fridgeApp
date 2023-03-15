import React, {useMemo, useState} from 'react'
import {useDefaultTranslation} from "../../../utils/TranslationsUtils";
import TopHeader from "../../layout/TopHeader/TopHeader";
import {useNavigation} from "@react-navigation/native";
import styled from "styled-components/native";
import {T2, T3} from "../../layout/Text/Text";
import FormTextInput from "../../layout/inputs/FormTextInput";
import ButtonWithLabel from "../../layout/inputs/ButtonWithLabel";
import COLORS from "../../../../assets/colors";
import {Screens} from "../../../navigation/Screens";
import {BottomWrapper, ScreenContainer} from "../../layout/common/Containers";
import {useAuth} from "../../../providers/AuthProvider";
import {usePopup} from "../../../providers/PopupProvider";
import {Keyboard} from "react-native";

const InfoText = styled(T2)`
  margin: 10px 15px;
  text-align: center;
`;

const WarningText = styled(T3)`
  margin: 5px 15px;
  color: ${COLORS.invalid};
  text-align: center;
`;

export default function SignUpScreen() {

  const { t } = useDefaultTranslation('myProfile');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [isSignupInProgress, setIsSignupInProgress] = useState(false);
  const navigation = useNavigation();
  const { signUp } = useAuth();
  const { openPopup, closePopup } = usePopup();

  const handleSignup = () => {
    setIsSignupInProgress(true);
    Keyboard.dismiss();
    signUp(email, password)
      .then(() => {
        openPopup({
          title: t("signupSuccess.title"),
          content: t("signupSuccess.content"),
          buttons: [
            {
              label: t("common:ok"),
              onPress: () => {
                closePopup();
                navigation.navigate(Screens.MY_PROFILE_SCREEN);
              }
            }
          ]
        });
      })
      .catch(error => {
        openPopup({
          title: t("signupFailed"),
          content: error.message,
          buttons: [{label: t("common:tryAgain"), onPress: closePopup}]
        });
      })
      .finally(() => setIsSignupInProgress(false));
  }

  function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }

  const warningTxt = useMemo(() => {
    if(email && !validateEmail(email)) return t("emailInvalid");
    if(password && password.length < 6) return t("passwordTooShort");
    if(password && passwordRepeat  && password !== passwordRepeat) return t("passwordsDoNotMatch");
    return '';
  }, [email, password, passwordRepeat]);

  const isInputDataValid = useMemo(
    () => email && password && passwordRepeat && !warningTxt,
    [email, password, passwordRepeat, warningTxt]
  );

  return (
    <ScreenContainer>
      <TopHeader title={t("header")} isMainScreen={false}/>
      <InfoText>{t("signupInfo")}</InfoText>
      <FormTextInput type={'email'} value={email} onValueChanged={setEmail} />
      <FormTextInput type={'password'} value={password} onValueChanged={setPassword} />
      <FormTextInput type={'password'} placeholder={t("passwordRepeat")} value={passwordRepeat} onValueChanged={setPasswordRepeat} />
      {!!warningTxt && <WarningText>{warningTxt}</WarningText>}
      <ButtonWithLabel label={t("signup")} onPress={handleSignup} isLoading={isSignupInProgress} isDisabled={!isInputDataValid} />
      <BottomWrapper>
        <InfoText>{t("alreadyHaveAccount")}</InfoText>
        <ButtonWithLabel label={t("login")} onPress={() => navigation.navigate(Screens.MY_PROFILE_SCREEN)} />
      </BottomWrapper>
    </ScreenContainer>
  );
}
