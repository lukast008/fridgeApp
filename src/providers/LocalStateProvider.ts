import {useEffect, useState} from "react";
import {asyncStorageService} from "../service/AsyncStorageService";

export type LocalStateProvider = {
  groupProductsWithCategories?: boolean;
  setGroupProductsWithCategories: (value: boolean) => void;
  currentUserEmail?: string;
  setCurrentUserEmail: (value?: string) => void;
}

export default function useLocalStateProvider(): LocalStateProvider {
  const {value: groupProductsWithCategories, setValueAndSave: setGroupProductsWithCategories} = useGroupProductsWithCategories();
  const {value: currentUserEmail, setValueAndSave: setCurrentUserEmail} = useCurrentUserEmail();

  return {
    groupProductsWithCategories, setGroupProductsWithCategories,
    currentUserEmail, setCurrentUserEmail
  };
}

const useGroupProductsWithCategories = () => {
  const KEY = "GROUP_PRODUCTS_WITH_CATEGORIES_KEY";
  const [value, setValue] = useState<boolean>();
  useEffect(() => {
    asyncStorageService.getData(KEY).then(result => setValue(result !== null && result === "true"));
  }, []);

  const setValueAndSave = (value: boolean) => {
    setValue(value);
    asyncStorageService.storeData(KEY, value.toString());
  }

  return {value, setValueAndSave};
}

const useCurrentUserEmail = () => {
  const KEY = "CURRENT_USER_EMAIL_KEY";
  const [value, setValue] = useState<string>();
  useEffect(() => {
    asyncStorageService.getData(KEY).then(result => result && setValue(result));
  }, []);

  const setValueAndSave = (value?: string) => {
    setValue(value);
    asyncStorageService.storeData(KEY, value || '');
  }

  return {value, setValueAndSave};
}
