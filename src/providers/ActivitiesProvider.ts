import {useData} from "./DataProvider";
import ActivityDto from "../dto/ActivityDto";
import {useEffect, useRef, useState} from "react";
import DateFilterDto from "../dto/DateFilterDto";
import ActivityModel from "../database/ActivityModel";
import {ProductActions} from "../data/productActionsData";
import {dateFilterService, DateFilterTypes} from "../service/DateFilterService";

export function useActivities(
    filterData: DateFilterDto,
    sortBy: string,
    sortReverse: boolean,
    searchValue: string): ActivityDto[] | null {

  const {realm} = useData();
  const [activities, setActivities] = useState<ActivityDto[] | null>(null);
  const activitiesRef = useRef<Realm.Results<ActivityDto & Realm.Object> | null>(null);

  useEffect(() => {
    console.log("useActivities -> useEffect -> " + filterData.value);
    if(!realm) return;
    fetchActivities(realm, filterData, sortBy, sortReverse, searchValue).then(syncActivities => {
      if (activitiesRef.current) activitiesRef.current?.removeAllListeners();
      activitiesRef.current = syncActivities;
      syncActivities.addListener(data => {
        setActivities([...data])
      });
    });

    return () => {
      if (activitiesRef.current) activitiesRef.current?.removeAllListeners();
      setActivities(null);
    }
  }, [filterData.name, searchValue, realm]);

  return activities;
}

export function useActivitiesForProductDefId(productDefId?: ObjectId): ActivityDto[] | null {

  const {realm} = useData();
  const [activities, setActivities] = useState<ActivityDto[] | null>(null);
  const activitiesRef = useRef<Realm.Results<ActivityDto & Realm.Object> | null>(null);

  useEffect(() => {
    console.log("useActivitiesForProductDefId -> useEffect -> " + productDefId?.toHexString());
    if(!realm || !productDefId) return;
    const filterAll = dateFilterService.prepareAllFilterData(new Date());
    fetchActivities(realm, filterAll, "actionDate", true, "", productDefId).then(syncActivities => {
      console.log("syncActivities: ", syncActivities.length);
      if (activitiesRef.current) activitiesRef.current?.removeAllListeners();
      activitiesRef.current = syncActivities;
      syncActivities.addListener(data => {
        setActivities([...data])
      });
    });

    return () => {
      if (activitiesRef.current) activitiesRef.current?.removeAllListeners();
      setActivities(null);
    }
  }, [productDefId?.toHexString(), realm]);

  return activities;
}

async function fetchActivities(
  realm: Realm,
  dateFilter: DateFilterDto,
  sortBy: string,
  sortReverse: boolean,
  searchValue: string,
  productDefId?: ObjectId):Promise<Realm.Results<ActivityDto & Realm.Object>> {

  let syncActivities = realm.objects<ActivityDto>(ActivityModel.schema.name);
  if(productDefId) {
    syncActivities = syncActivities.filtered("product.definition._id = $0", productDefId);
  }
  syncActivities = syncActivities.filtered("product.definition.name CONTAINS[c] $0", searchValue);
  syncActivities = syncActivities.filtered("isActive = true AND actionType != $0", ProductActions.EDIT);
  if (dateFilter.id !== DateFilterTypes.ALL) {
    syncActivities = syncActivities.filtered("actionDate > $0 AND actionDate <= $1", dateFilter.startDate, dateFilter.endDate);
  }
  return syncActivities.sorted(sortBy, sortReverse);
}
