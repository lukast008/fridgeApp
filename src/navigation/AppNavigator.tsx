import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {Screens} from "./Screens";
import ProductsScreen from "../components/screens/ProductsScreen";
import AddProductScreen from "../components/screens/AddProductScreen";
import ProductSummaryScreen from "../components/screens/ProductSummaryScreen";
import StatisticsScreen from "../components/screens/StatisticsScreen";
import {NavigationContainer} from "@react-navigation/native";
import COLORS from "../../assets/colors";
import i18n from "../utils/TranslationsUtils";
import {Icon} from "react-native-elements";
import ActivityScreen from "../components/screens/ActivityScreen";
import MyProfileScreen from "../components/screens/settings/MyProfileScreen";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import SettingsScreen from "../components/screens/settings/SettingsScreen";
import UserDataScreen from "../components/screens/settings/UserDataScreen";
import LibrariesAndIconsScreen from "../components/screens/settings/LibrariesAndIconsScreen";
import ProductsLibraryScreen from "../components/screens/settings/ProductsLibraryScreen";
import ProductCategoriesScreen from "../components/screens/settings/ProductCategoriesScreen";
import ProductsLibraryEditScreen from "../components/screens/settings/ProductsLibraryEditScreen";
import SignUpScreen from "../components/screens/settings/SignUpScreen";
import ShoppingListScreen from "../components/screens/ShoppingListScreen";
import LogsScreen from "../components/screens/settings/LogsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function tabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={Screens.PRODUCTS_SCREEN}
      tabBarOptions={{activeTintColor: COLORS.primary, keyboardHidesTabBar: true, showLabel: true}}
    >
      <Tab.Screen
        name={Screens.PRODUCTS_SCREEN}
        component={ProductsScreen}
        options={{
          title: i18n.t("product:header"),
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name={Screens.ACTIVITIES_SCREEN}
        component={ActivityScreen}
        options={{
          title: i18n.t("activity:header"),
          tabBarIcon: ({ color }) => <Icon name="history" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name={Screens.SHOPPING_LIST_SCREEN}
        component={ShoppingListScreen}
        options={{
          title: i18n.t("shoppingList:header"),
          tabBarIcon: ({ color }) => <Icon name="shopping-basket" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name={Screens.STATISTICS_SCREEN}
        component={StatisticsScreen}
        options={{
          title: i18n.t("statistics:header"),
          tabBarIcon: ({ color }) => <Icon name="timeline" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name={Screens.SETTINGS_SCREEN}
        component={SettingsScreen}
        options={{
          title: i18n.t("settings:header"),
          tabBarIcon: ({ color }) => <Icon name="settings" color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tabs" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Tabs" component={tabNavigator} />
        <Stack.Screen name={Screens.ADD_PRODUCT_SCREEN} component={AddProductScreen} />
        <Stack.Screen name={Screens.PRODUCT_SUMMARY_SCREEN} component={ProductSummaryScreen} />
        <Stack.Screen name={Screens.MY_PROFILE_SCREEN} component={MyProfileScreen} />
        <Stack.Screen name={Screens.USER_DATA_SCREEN} component={UserDataScreen} />
        <Stack.Screen name={Screens.LIBRARIES_AND_ICONS_SCREEN} component={LibrariesAndIconsScreen} />
        <Stack.Screen name={Screens.PRODUCTS_LIBRARY_SCREEN} component={ProductsLibraryScreen} />
        <Stack.Screen name={Screens.PRODUCTS_LIBRARY_EDIT_SCREEN} component={ProductsLibraryEditScreen} />
        <Stack.Screen name={Screens.PRODUCT_CATEGORIES_SCREEN} component={ProductCategoriesScreen} />
        <Stack.Screen name={Screens.SIGNUP_SCREEN} component={SignUpScreen} />
        <Stack.Screen name={Screens.LOGS_SCREEN} component={LogsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
