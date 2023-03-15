
export const Screens = {
  PRODUCTS_SCREEN: "ProductsScreen",
  ADD_PRODUCT_SCREEN: "AddProductScreen",
  PRODUCT_SUMMARY_SCREEN: "ProductSummaryScreen",
  ACTIVITIES_SCREEN: "ActivitiesScreen",
  STATISTICS_SCREEN: "StatisticsScreen",
  SHOPPING_LIST_SCREEN: "ShoppingListScreen",
  SETTINGS_SCREEN: "SettingsScreen",
  MY_PROFILE_SCREEN: "MyProfileScreen",
  USER_DATA_SCREEN: "UserDataScreen",
  ABOUT_SCREEN: "AboutScreen",
  LIBRARIES_AND_ICONS_SCREEN: "LibrariesAndIconsScreen",
  PRODUCTS_LIBRARY_SCREEN: "ProductsLibraryScreen",
  PRODUCTS_LIBRARY_EDIT_SCREEN: "ProductsLibraryEditScreen",
  PRODUCT_CATEGORIES_SCREEN: "ProductCategoriesScreen",
  SIGNUP_SCREEN: "SignUpScreen",
  LOGS_SCREEN: "LogsScreen",
}

export type ParamList = {
  "AddProductScreen": {
    productId: string;
    definitionId: ObjectId;
    origin: string;
    name: string;
  },
  "ProductsScreen": {
    productName: string;
  },
  "ProductSummary": {
    definitionId: ObjectId;
  },
  "ProductsLibraryScreen": {
    productDefId: ObjectId
  },
  "ProductsLibraryEditScreen": {
    productDefId: ObjectId,
    origin: string;
  },
  "ProductCategoriesScreen": {
    productCategoryId: ObjectId
  }
}
