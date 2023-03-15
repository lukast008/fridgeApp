import React, {useContext, useEffect, useRef, useState} from "react";
import ProductDto from "../dto/Product/ProductDto";
import {ConnectionState, UpdateMode} from "realm";
import ProductModel from "../database/ProductModel";
import ActivityModel from "../database/ActivityModel";
import {openRealm} from "../database/realm";
import ActivityDto from "../dto/ActivityDto";
import {ProductActions} from "../data/productActionsData";
import {useAuth} from "./AuthProvider";
import {productService} from "../service/ProductService";
import ProductSuggestionDto from "../dto/Product/ProductSuggestionDto";
import ConnectionStatusDto from "../dto/ConnectionStatusDto";
import ProductDefinitionModel from "../database/ProductDefinitionModel";
import ProductDefDto from "../dto/Product/ProductDefDto";
import SplashScreen from 'react-native-splash-screen'
import useProductsLibraryProvider, {ProductsLibraryProvider} from "./ProductsLibraryProvider";
import useProductCategoriesProvider, {ProductsCategoriesProvider} from "./ProductCategoriesProvider";
import useLocalStateProvider, {LocalStateProvider} from "./LocalStateProvider";
import useShoppingListProvider, {ShoppingListProvider} from "./ShoppingListProvider";
import {useLogger} from "./AppInfoProvider";
import DateUtils from "../utils/DateUtils";

type DataContextType = {
  realm: Realm | null;
  products: ProductDto[] | null;
  fetchProductSuggestions: () => Promise<ProductSuggestionDto[]>;
  initProducts: () => Promise<void>;
  saveProduct: (product: ProductDto, isNew: boolean) => Promise<void>;
  getProductById: (id: string) => ProductDto | null;
  getProductDefById: (id: ObjectId) => ProductDefDto | null;
  getProductsByDefId: (defId: ObjectId) => Promise<Realm.Results<ProductDto & Realm.Object>>;
  getActivitiesForProduct: (id: string) => ActivityDto[];
  clearDataState: () => void;
  deleteAllData: () => Promise<void>;
  connectionStatus: ConnectionStatusDto;
  productLibraryProvider: ProductsLibraryProvider;
  productCategoriesProvider: ProductsCategoriesProvider;
  localStateProvider: LocalStateProvider;
  shoppingListProvider: ShoppingListProvider;
}

const DataContext = React.createContext<DataContextType | null>(null);

function DataProvider({children}: any) {

  const [products, setProducts] = useState<ProductDto[] | null>(null);
  const [connectionStatus, setConnectionStatus] = useState(new ConnectionStatusDto());
  const { logger } = useLogger('DataProvider');

  const realmRef = useRef<Realm | null>(null);
  const { user } = useAuth();

  const shoppingListProvider = useShoppingListProvider(realmRef.current, user);
  const productCategoriesProvider = useProductCategoriesProvider(realmRef.current, user);
  const productLibraryProvider = useProductsLibraryProvider(realmRef.current, user, productCategoriesProvider.fetchNoCategory);

  useEffect(() => {
    user
      ? logger.info("Init data in online mode for user: " + user.id)
      : logger.info("Init data in offline mode");
    initProducts().then(() => setTimeout(() => SplashScreen.hide(), 500));

    return () => {
      logger.info("cleanup data");
      cleanUpRealm();
    }
  }, [user]);

  function cleanUpRealm() {
    const realm = realmRef.current;
    setProducts(null);
    if(realm && !realm.isClosed) {
      realm.removeAllListeners();
      //realm.close(); //TODO -> check if needed
      realmRef.current = null;
    }
  }

  function onRealmChange(realm: Realm) {
    updateStatus(realm.syncSession?.connectionState);
  }

  function updateStatus(state?: ConnectionState) {
    setConnectionStatus(new ConnectionStatusDto(state));
  }

  async function fetchProducts(realm: Realm) {
    try {
      const timeStart = new Date();
      const syncProducts = realm.objects<ProductDto>(ProductModel.schema.name);
      let productsFiltered = syncProducts.filtered("isActive = TRUE AND unitValue > 0").sorted("expirationDate");
      const timeDiff = DateUtils.getDiffInMs(timeStart, new Date());
      logger.info(`Fetched ${productsFiltered.length} products in ${timeDiff} ms`);
      syncProducts.addListener(() => {
        setProducts([...productsFiltered]);
      });
    } catch (e) {
      logger.error(`Failed to fetch products: ${e}. Try again...`);
      setProducts([]);
      setTimeout(() => initProducts(), 1000);
    }
  }

  async function initProducts() {
    logger.info(`Init products`);
    cleanUpRealm();
    try {
      await openRealm(user).then(realm => {
        realmRef.current = realm;
        realm.addListener("change", onRealmChange);
        realm.syncSession?.addConnectionNotification(updateStatus);
        updateStatus(realm.syncSession?.connectionState);
        fetchProducts(realm);
      });
    } catch (e) {
      logger.error(`Failed to init products: ${e}`); // TODO handle global error
    }
  }

  async function saveProduct(product: ProductDto, isNew: boolean) {
    if(isNew) return createProduct(product);
    else return updateProduct(product);
  }

  async function createProduct(product: ProductDto) {
    logger.info(`save new product: ${product}`);
    const activity = new ActivityDto(ProductActions.ADD, product.unitValue, product, product.creationDate);
    const realm = realmRef.current;
    if(realm) {
      realm.write(() => {
        product.partitionKey = user?.id || "";
        activity.partitionKey = user?.id || "";
        realm.create(ProductModel.schema.name, product, UpdateMode.All);
        realm.create(ActivityModel.schema.name, activity, UpdateMode.All);
      });
    }
  }

  async function updateProduct(product: ProductDto) {
    logger.info(`update product: ${product}`);
    const activity = new ActivityDto(ProductActions.EDIT, 0, product, new Date());
    const realm = realmRef.current;
    if(realm) {
      let currentProduct = realm.objectForPrimaryKey<ProductDto>(ProductModel.schema.name, product._id);
      if(!currentProduct) throw new Error("There is no product with id: " + product._id);
      let addActivity = [...realm.objects<ActivityDto>(ActivityModel.schema.name)
        .filtered("product._id = $0 and actionType = $1", product._id, ProductActions.ADD)][0];
      if(!addActivity) throw new Error("There is no add activity");
      const unitValueDiff = product.unitValue - currentProduct.unitValue;
      realm.write(() => {
        product.partitionKey = user?.id || "";
        activity.partitionKey = user?.id || "";
        addActivity.actionDate = product.creationDate;
        addActivity.unitValue += unitValueDiff;
        realm.create(ProductModel.schema.name, product, UpdateMode.All);
        realm.create(ActivityModel.schema.name, activity, UpdateMode.All);
      });
    }
  }

  async function fetchProductSuggestions(): Promise<ProductSuggestionDto[]> {
    if(realmRef.current) {
      const syncActivities = realmRef.current.objects<ActivityDto>(ActivityModel.schema.name);
      let distinctActivities = syncActivities
        .filtered("product.definition.isActive = TRUE")
        .filtered("actionType = 'add' SORT(actionDate DESC) DISTINCT(product.definition._id)");
      const suggestions = productService.convertActivitiesToProductSuggestions([...distinctActivities], productLibraryProvider.productDefs);
      logger.info("Fetched product suggestions: " + suggestions.length);
      return suggestions;
    } else throw Error("Realm not opened");
  }

  function getProductById(id: string): ProductDto | null {
    if(realmRef.current) {
      return realmRef.current.objectForPrimaryKey<ProductDto>(ProductModel.schema.name, id) || null;
    } else {
      throw Error("Cannot connect to database");
    }
  }

  function getProductDefById(id: ObjectId): ProductDefDto | null {
    if(realmRef.current) {
      return realmRef.current.objectForPrimaryKey<ProductDefDto>(ProductDefinitionModel.schema.name, id) || null;
    } else {
      throw Error("Cannot connect to database");
    }
  }

  async function getProductsByDefId(defId: ObjectId): Promise<Realm.Results<ProductDto & Realm.Object>> {
    if(realmRef.current) {
      const syncProducts = realmRef.current.objects<ProductDto>(ProductModel.schema.name);
      return syncProducts
        .filtered("definition._id = $0 AND isActive = TRUE AND unitValue > 0", defId)
        .sorted("expirationDate");
    } else {
      throw Error("TODO");
    }
  }

  function getActivitiesForProduct(id: string): ActivityDto[] {
    if(realmRef.current) {
      const syncActivities = realmRef.current.objects<ActivityDto>(ActivityModel.schema.name);
      let itemsFiltered = syncActivities
        .filtered("product._id = $0", id)
        .filtered("isActive = true")
        .filtered("actionType != $0", ProductActions.EDIT);
      return [...itemsFiltered];
    } else {
      return [];
    }
  }

  async function clearDataState() {
    setProducts(null);
  }

  async function deleteAllData() {
    const realm = realmRef.current;
    setProducts(null);
    if(realm) realm.write(() => realm.deleteAll());
  }

  return(
    <DataContext.Provider
      value={{
        realm: realmRef.current && !realmRef.current.isClosed ? realmRef.current : null,
        products,
        fetchProductSuggestions,
        initProducts,
        saveProduct,
        getProductById,
        getProductDefById,
        getProductsByDefId,
        getActivitiesForProduct,
        clearDataState,
        deleteAllData,
        connectionStatus,
        productLibraryProvider,
        productCategoriesProvider,
        localStateProvider: useLocalStateProvider(),
        shoppingListProvider,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

const useData = () => {
  const dataContext = useContext(DataContext);
  if(dataContext == null) {
    throw new Error("useData() called outside of a DataProvider?");
  }
  return dataContext;
}

export {DataProvider, useData};
