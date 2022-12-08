import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, ToastAndroid, Alert } from 'react-native';

import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import {
    setCurrentOrder, setOrderDetailVisibility,
    setLoaderVisibility
} from '../../../service/applicable/order.sa/Order.redux.sa';

import useDailyOrder from '../../../service/applicable/order.sa/Order.sa';
import useFood from '../../../service/applicable/food.sa/Food.sa';
import {
    setIsLoadingPopularFood,
    setPopularFood
} from '../../../service/applicable/food.sa/Food.redux.sa';

import isCloseToBottom from '../../../common/utils/IsScrollViewCloseReachedEnd';

import SearchHeader from '../../layouts/searchHeader';
import OrderListItem from '../../components/OrderListItem';
import DailyOrderEnum from '../../../data/constant/DailyOrderEnum';
import useOrderHooks from '../../hooks/userOrderHooks';

const styles = StyleSheet.create({
    header: {
        marginHorizontal: 20,
        flexDirection: "row",
        justifyContent: "center"
    }
})

const Search = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { onNextStep, onExport, onCancel } = useOrderHooks()
    const { searchOrder, exportOrder, nextStepOrder, cancelOrder } = useDailyOrder();
    const { getPopularFood } = useFood();
    const getFood = () => {
        dispatch(setIsLoadingPopularFood(true));
        getPopularFood(0, 10)
            .then((result) => {
                dispatch(setPopularFood(result?.data || []));
                dispatch(setIsLoadingPopularFood(false));
            })
            .catch((error) => {
                dispatch(setPopularFood([]));
                dispatch(setIsLoadingPopularFood(false));
                ToastAndroid.show("Error while getting popular food from server, please try again :(", ToastAndroid.LONG);
            })
    }

    const [isLoading, setIsLoading] = useState(false);

    const [page, setPages] = useState({
        pageNo: 0,
        pageSize: 10
    });

    const [search, setSearch] = useState("");

    const [orders, setOrders] = useState([]);

    const [totalElements, setTotalElements] = useState(0);

    const onStartLoading = () => {
        setIsLoading(true);
    }

    const onChange = (value) => {


        setSearch(value);
        searchOrder(page.pageNo, page.pageSize, value)
            .then((result) => {
                setOrders(result?.data);
                setTotalElements(result?.totalElements)
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                setOrders([]);
                ToastAndroid.show("Error while getting search result from server, please try again :(", ToastAndroid.LONG);
            })
    }

    const onAddOlderOrder = (value) => {
        searchOrder(page.pageNo + 1, page.pageSize, value)
            .then((result) => {
                setOrders(result?.data);
                setTotalElements(result?.totalElements)
                setIsLoading(false);
                setPages({
                    pageNo: page.pageNo + 1,
                    pageSize: 10
                })
            })
            .catch((error) => {
                setIsLoading(false);
                ToastAndroid.show("Error while getting search result from server, please try again :(", ToastAndroid.LONG);
            })
    }

    const onDetail = (id, index) => {
        if (index !== null && index !== undefined) {
            dispatch(setOrderDetailVisibility(true));
            dispatch(setCurrentOrder(orders[index]));
        }
        navigation.goBack();
    }

    const formatDailyOrderFoods = (dailyOrderFoods) => {
        let result = "";
        (dailyOrderFoods || []).map((order, index) => {
            let foodName = order?.food?.label;
            if (index === 0) {
                result = foodName;
            } else {
                result = result + `, ${foodName}`;
            }
        })
        return result;
    }

    return (
        <View style={{ flex: 1 }}>
            <SearchHeader onChange={onChange} startLoading={onStartLoading} placeholder="Search..." />
            {isLoading ?
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#4eac6d" />
                </View>
                :
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='always'
                    contentContainerStyle={{ marginLeft: 20, marginBottom: 20 }}
                    data={[...orders, { plusLoader: true }]}
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (orders.length < totalElements) {
                                onAddOlderOrder(search);
                            }
                        }
                    }}
                    keyExtractor={(item, index) => { return `indexOrderSearchScreen-${item?.id}` }}
                    renderItem={({ index, item }) => {
                        if (item.plusLoader) {
                            return <>
                                {index < (totalElements - page.pageSize + 1) ?
                                    <View style={{ marginTop: 20, marginBottom: 20, alignItems: "center" }}>
                                        <ActivityIndicator size="large" color="#4eac6d" />
                                    </View> : <></>}</>
                        }
                        return (
                            <OrderListItem
                                key={`index-${item?.id}`}
                                title={item?.client?.firstname}
                                subTitle={formatDailyOrderFoods(item?.dailyOrderFoods)}
                                onStatus={() => onNextStep(item?.id, index)}
                                onExport={() => onExport(item?.id, index)}
                                onDetail={() => onDetail(item?.id, index)}
                                onCancel={() => onCancel(item?.id, index)}
                                status={item?.status}
                                disabled={{
                                    detail: false,
                                    status: DailyOrderEnum.DELIVERED.name === item?.status || DailyOrderEnum.CANCELED.name === item?.status ? true : false,
                                    export: false,
                                    cancel: DailyOrderEnum.DELIVERED.name === item?.status || DailyOrderEnum.CANCELED.name === item?.status ? true : false,
                                }}
                            />)
                    }
                    } />
            }
        </View>
    );
}

export default Search;