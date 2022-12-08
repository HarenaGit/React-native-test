import React, { useState, useEffect } from 'react';
import { Dimensions, TouchableOpacity, View, ScrollView, FlatList, ToastAndroid, ActivityIndicator, Modal, Alert } from 'react-native';
import 'react-native-gesture-handler';
import StaggeredList from '@mindinventory/react-native-stagger-view';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';

import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import useDailyOrder from '../../../service/applicable/order.sa/Order.sa';
import useFood from '../../../service/applicable/food.sa/Food.sa';
import {
    setDailyOrders, addDailyOrders,
    setIsDailyOrdersLoading, setPageNo,
    setIsDailyOlderOrdersLoading, setFilterStatus,
    setTotalElements, setCurrentOrderDate,
    setCurrentOrder, setOrderDetailVisibility,
    setLoaderVisibility
} from '../../../service/applicable/order.sa/Order.redux.sa';

import isCloseToBottom from '../../../common/utils/IsScrollViewCloseReachedEnd';

import Header from '../../layouts/header.v.1';
import Typography from '../../components/Typography';
import ButtonList from '../../components/ButtonList';
import OrderCard from '../../components/OrderCard';
import OrderListItem from '../../components/OrderListItem';
import DailyOrderEnum from '../../../data/constant/DailyOrderEnum';
import EmptyResult from '../../components/EmptyResult';
import useOrderHooks from '../../hooks/userOrderHooks';


const OrderScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { orders, loading, pageNo, pageSize, olderLoading, filter, totalElements, currentDate, OrderDetailVisibility, currentOrder, loaderVisibility } = useSelector((state) => {
        return {
            orders: state.dailyOrders.orders,
            loading: state.dailyOrders.loading,
            pageNo: state.dailyOrders.pageNo,
            pageSize: state.dailyOrders.pageSize,
            olderLoading: state.dailyOrders.loadingOlderData,
            filter: state.dailyOrders.filter,
            totalElements: state.dailyOrders.totalElements,
            currentDate: state.dailyOrders.currentOrderDate,
            currentOrder: state.dailyOrders.currentOrder,
            OrderDetailVisibility: state.dailyOrders.OrderDetailVisibility,
            loaderVisibility: state.dailyOrders.loaderVisibility
        }
    }
    );
    const { getDailyOrders, onAddOlderOrder, onNextStep, onExport, onCancel } = useOrderHooks();
    const [viewType, setViewType] = useState("list");

    const onDetail = (id, index) => {
        if (index !== null && index !== undefined) {
            dispatch(setOrderDetailVisibility(true));
            dispatch(setCurrentOrder(orders[index]));
        }
    }

    const onFilter = async (id) => {
        switch (id) {
            case 0:
                dispatch(setFilterStatus(DailyOrderEnum.ALL.name));
                getDailyOrders(DailyOrderEnum.ALL.name);
                break;
            case 1:
                dispatch(setFilterStatus(DailyOrderEnum.IN_PROGRESS.name));
                getDailyOrders(DailyOrderEnum.IN_PROGRESS.name);
                break;
            case 2:
                dispatch(setFilterStatus(DailyOrderEnum.SENT.name));
                getDailyOrders(DailyOrderEnum.SENT.name);
                break;
            case 3:
                dispatch(setFilterStatus(DailyOrderEnum.DELIVERED.name));
                getDailyOrders(DailyOrderEnum.DELIVERED.name);
                break;
            case 4:
                dispatch(setFilterStatus(DailyOrderEnum.CANCELED.name));
                getDailyOrders(DailyOrderEnum.CANCELED.name);
                break;
            default:
        }
    }

    useEffect(() => {
        dispatch(setPageNo(0));
        getDailyOrders(filter?.status);
    }, []);

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

    const convertDateToReadableString = (date) => {
        if (date === "" || date === null || date === undefined) {
            const d = new Date();
            return moment(d).format("MMMM ,  YYYY");
        }
        const d = new Date(date);
        return moment(d).format("MMMM , YYYY");
    }

    return (
        <View style={{ flex: 1, marginBottom: 75 }}>
            <Header title={`Order (${totalElements})`} includeSearch={true} onSearch={() => { navigation.navigate('Search') }} />

            <View style={{ marginTop: 20, marginHorizontal: 21 }} >
                <ButtonList onPress={onFilter}
                    buttonList={[{ title: "ALL" }, { title: "IN PROGRESS" }, { title: "SENT" }, { title: "DELIVERED" }, { title: "CANCELED" }]} />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
                <Typography variant="title" style={{ fontSize: 20, marginLeft: 21 }} >- {convertDateToReadableString(currentDate)} -</Typography>
                <TouchableOpacity style={{ width: 50, height: 70, justifyContent: "center", alignItems: "center" }} onPress={() => setViewType(viewType === "grid" ? "list" : "grid")}>
                    <Typography variant="title" style={{ fontSize: 16, color: "rgba(0,0,0,0.3)", marginTop: -4 }} >
                        <FontAwesome5
                            name={viewType === "grid" ? "columns" : "th-list"}
                            size={17}
                            color={'rgba(0,0,0,0.8)'}
                        ></FontAwesome5>
                    </Typography>
                </TouchableOpacity>
            </View>
            {orders?.length === 0 || orders === null ? <EmptyResult title="No orders" /> : <>
                {loading ? <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#4eac6d" />
                </View> : <>{viewType === "grid" ? <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='always'
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (orders.length < totalElements) {
                                onAddOlderOrder(filter?.status)
                            }
                        }
                    }}
                >
                    <StaggeredList
                        data={[...orders, , { plusLoader: true }]}
                        contentContainerStyle={{ flex: 1, marginRight: 20, marginLeft: 10 }}
                        animationType={'FADE_IN_FAST'}
                        alwaysBounceVertical={true}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ i, item }) => {
                            if (item?.plusLoader) {
                                return <>
                                    {i < (totalElements - pageSize + 1) ?
                                        <View style={{ marginTop: 20, marginBottom: 20, alignItems: "center" }}>
                                            <ActivityIndicator size="large" color="#4eac6d" />
                                        </View> : <></>}</>
                            }
                            return (
                                <View key={`index-${i}`} style={{
                                    width: (Dimensions.get("window").width - 50) / 2,
                                    height: Number(Math.random() * 20 + 12) * 10,
                                    backgroundColor: 'gray',
                                    margin: 4,
                                    marginHorizontal: 10,
                                    borderRadius: 10,
                                    overflow: 'hidden'
                                }} >
                                    <OrderCard
                                        title={item?.client?.firstname}
                                        subTitle={formatDailyOrderFoods(item?.dailyOrderFoods)}
                                        onStatus={() => onNextStep(item?.id, i)}
                                        onExport={() => onExport(item?.id, i)}
                                        onDetail={() => { onDetail(item?.id, i) }}
                                        onCancel={() => onCancel(item?.id, i)}
                                        status={item?.status}
                                        disabled={{
                                            detail: false,
                                            status: DailyOrderEnum.DELIVERED.name === item?.status || DailyOrderEnum.CANCELED.name === item?.status ? true : false,
                                            export: false,
                                            cancel: DailyOrderEnum.DELIVERED.name === item?.status || DailyOrderEnum.CANCELED.name === item?.status ? true : false,
                                        }}
                                    />
                                </View>)
                        }
                        }

                        isLoading={true}
                        LoadingView={
                            <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
                                <ActivityIndicator size="large" color="#4eac6d" />
                            </View>
                        }
                    />
                </ScrollView> : <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='always'
                    contentContainerStyle={{ marginLeft: 20, marginBottom: 20 }}
                    data={[...orders, { plusLoader: true }]}
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (orders.length < totalElements) {
                                onAddOlderOrder(filter?.status)
                            }
                        }
                    }}
                    keyExtractor={(item, index) => { return `indexOrderScreen-${item?.id}` }}
                    renderItem={({ index, item }) => {
                        if (item.plusLoader) {
                            return <>
                                {index < (totalElements - pageSize + 1) ?
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
                    } />}</>}
            </>}

        </View >
    );
}

export default OrderScreen;