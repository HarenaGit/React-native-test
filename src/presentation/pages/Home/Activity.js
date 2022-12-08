import React, { useEffect } from 'react';
import { View, FlatList, ToastAndroid, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';


import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import {
    setCurrentOrder, setOrderDetailVisibility
} from '../../../service/applicable/order.sa/Order.redux.sa';

import Typography from '../../../presentation/components/Typography';
import OrderCard from '../../../presentation/components/OrderCard';
import PopularFood from '../../../presentation/components/PopularFood';
import DailyOrderEnum from '../../../data/constant/DailyOrderEnum';
import EmptyResult from '../../components/EmptyResult';
import useOrderHooks from '../../hooks/userOrderHooks';
import useFoodHooks from '../../hooks/useFoodHooks';


const Activity = ({ isActive = false }) => {

    const dispatch = useDispatch();
    const { getHomeOrder, onNextStep } = useOrderHooks();
    const { getFood } = useFoodHooks();
    const navigation = useNavigation();

    const { homeOrder, homeOrderLoading, popularFood, isLoadingPopularFood } = useSelector((state) => {
        return {
            homeOrder: state.dailyOrders.homeOrder,
            homeOrderLoading: state.dailyOrders.homeOrderLoading,

            popularFood: state.food.popularFood,
            isLoadingPopularFood: state.food.isLoadingPopularFood
        }
    }
    );

    const onDetail = (id, index) => {
        if (index !== null && index !== undefined) {
            dispatch(setOrderDetailVisibility(true));
            dispatch(setCurrentOrder(homeOrder[index]));
        }
    }

    useEffect(() => {
        if (isActive) {
            getHomeOrder();
            getFood();
        }
    }, [isActive]);

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
        <React.Fragment>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 21 }}>
                <Typography variant="title" style={{ fontSize: 20 }} >Order</Typography>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("Order");
                }}>

                    <Typography variant="title" style={{ fontSize: 16, color: "rgba(0,0,0,0.3)" }} >See all</Typography>
                </TouchableOpacity>
            </View>

            {homeOrder.length === 0 || homeOrder === null ? <>
                <View style={{ flex: 1, height: 190, justifyContent: "center", alignItems: "center" }}>
                    <EmptyResult title="No order for now..." />
                </View>
            </> : <>
                {homeOrderLoading ? <>
                    <View style={{ flex: 1, height: 150, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#4eac6d" />
                    </View>
                </> :
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ marginLeft: 20, marginTop: 20, marginBottom: 20 }}
                        data={homeOrder}
                        renderItem={({ item, index }) => (<View key={`indexOrder-${index}`} style={{
                            width: 240, height: 150, marginRight: 22,
                            backgroundColor: "#ccc",
                            borderColor: "#ccc",
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderRadius: 10,
                            overflow: "hidden",
                        }}><OrderCard key={`index-${index}`}
                            title={item?.client?.firstname}
                            subTitle={formatDailyOrderFoods(item?.dailyOrderFoods)}
                            onStatus={() => { onNextStep(item?.id, index) }}
                            onDetail={() => { onDetail(item?.id, index) }}
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
                        keyExtractor={(item, index) => `indexOrder-${index}`}
                    />}</>}

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 21 }}>
                <Typography variant="title" style={{ fontSize: 20 }} >Popular Food</Typography>
                <Typography variant="title" style={{ fontSize: 16, color: "rgba(0,0,0,0.3)" }} ></Typography>
            </View>
            {popularFood.length === 0 || popularFood === null ? <>
                <View style={{ flex: 1, height: 190, justifyContent: "center", alignItems: "center" }}>
                    <EmptyResult title="No popular food for now..." />
                </View>
            </> : <>
                {
                    isLoadingPopularFood ? <>
                        <View style={{ flex: 1, height: 150, justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator size="large" color="#4eac6d" />
                        </View>
                    </> : <>
                        <FlatList
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ marginLeft: 20, marginTop: 20, marginBottom: 20 }}
                            data={popularFood}
                            renderItem={({ item, index }) => (<PopularFood key={`indexPopular-${index}`} foodName={item?.label} numberOfOrders={item?.numberOfOrders} />)}
                            keyExtractor={(item, index) => `indexPopular-${index}`}
                        />
                    </>
                }
            </>}

        </React.Fragment>
    );
}

export default Activity;