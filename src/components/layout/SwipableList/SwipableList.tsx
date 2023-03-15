import React, {useEffect, useMemo, useRef, useState} from 'react'
import {Dimensions, FlatList, StyleSheet, View, ViewToken} from 'react-native'
import {dateFilterService, DateFilterTypes} from "../../../service/DateFilterService";
import DateFilterDto from "../../../dto/DateFilterDto";

const { width } = Dimensions.get('window');
const MARGIN = 0;
const CONTENT_WIDTH = width - 2*MARGIN;

type Props = {
  currentIndex: number;
  filterType: string;
  onIndexUpdated: (index: number) => void;
  renderContent: (filterData: DateFilterDto) => JSX.Element;
}

function initList() {
  return Array.apply(null, Array(1000)).map(function (x, i) { return {index: i}; });
}

export default function SwipableList(props: Props) {

  const [currentIndex, setCurrentIndex] = useState(props.currentIndex);
  const screenNumbers = useMemo(() => initList(), []);

  const flatListRef = useRef<FlatList | null>(null);
  const onViewRef = useRef((info: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => {
    if(info && info.changed.length == 2) {
      const index = info.changed[0].index;
      const prevIndex = info.changed[1].index;
      if(index != null && prevIndex != null && Math.abs(index - prevIndex) === 1) {
        setCurrentIndex(index);
        props.onIndexUpdated(index);
      }
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })

  useEffect(() => {
    props.onIndexUpdated(0);
    setTimeout(() => {
      if(flatListRef.current) flatListRef.current.scrollToIndex({index:0, animated: true});
    }, 100);
  }, [props.filterType]);

  useEffect(() => {
    const currentIndexFromProps = props.currentIndex;
    if(currentIndex != currentIndexFromProps) {
      setCurrentIndex(currentIndexFromProps);
      setTimeout(() => {
        if(flatListRef.current) flatListRef.current.scrollToIndex({index:currentIndexFromProps, animated: true});
      }, 100);
    }
  }, [props.currentIndex]);

  function renderListItem({item}: any) {
    if(props.filterType === DateFilterTypes.ALL && item.index !== 0) return <></>;
    const filterData = dateFilterService.getFilterData(props.filterType, item.index);
    return(
      <View style={styles.content}>
        {props.renderContent(filterData)}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={screenNumbers}
        renderItem={renderListItem}
        keyExtractor={item => item.index.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        pagingEnabled={true}
        scrollEnabled={props.filterType !== DateFilterTypes.ALL}
        initialScrollIndex={0}
        inverted={true}
        initialNumToRender={1}
        maxToRenderPerBatch={3}
        windowSize={props.filterType !== DateFilterTypes.ALL ? 2 : 1}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  content: {
    margin: MARGIN,
    width: CONTENT_WIDTH,
  },
})
