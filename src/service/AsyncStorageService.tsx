import AsyncStorage from '@react-native-async-storage/async-storage';

class AsyncStorageService {

  async storeData(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  }

  async getData(key: string): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(key)
      return value;
    } catch(e) {
      // error reading value
      return null;
    }
  }
}

export const asyncStorageService = new AsyncStorageService();
