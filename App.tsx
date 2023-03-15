import React from 'react';
import {AuthProvider} from "./src/providers/AuthProvider";
import {DataProvider} from "./src/providers/DataProvider";
import {AppNavigator} from "./src/navigation/AppNavigator";
import COLORS from "./assets/colors";
import {StatusBar} from "react-native";
import PopupProvider from "./src/providers/PopupProvider";
import {AppInfoProvider} from "./src/providers/AppInfoProvider";

const App = () => {
  return (
    <>
      <StatusBar hidden={false} backgroundColor={COLORS.primary} translucent={true}/>
      <AppInfoProvider>
        <PopupProvider>
          <AuthProvider>
            <DataProvider>
              <AppNavigator />
            </DataProvider>
          </AuthProvider>
        </PopupProvider>
      </AppInfoProvider>
    </>
  );
};

export default App;
