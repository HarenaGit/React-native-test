import React, { useState } from 'react';
import { ActivityIndicator, ToastAndroid, View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import useDailyOrder from '../../../service/applicable/order.sa/Order.sa';
import useFood from '../../../service/applicable/food.sa/Food.sa';
import {
    setDailyOrders, addDailyOrders,
    setIsDailyOrdersLoading, setPageNo,
    setIsDailyOlderOrdersLoading, setFilterStatus,
    setTotalElements, setCurrentOrderDate,
    setCurrentOrder, setOrderDetailVisibility,
    setLoaderVisibility, setHomeOrder, setHomeOrderLoading
} from '../../../service/applicable/order.sa/Order.redux.sa';

import IconButton from '../../components/IconButton';
import Button from '../../components/Button';
import Typography from '../../components/Typography';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import Stepper from '../../components/Stepper';
import DailyOrderEnum from '../../../data/constant/DailyOrderEnum';
import useOrderHooks from '../../hooks/userOrderHooks';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: 10
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50
    },
    clientInfo: {

    }
})

const DetailOrder = () => {

    const dispatch = useDispatch();
    const { onNextStep, onExport, onCancel } = useOrderHooks();
    const { orders, loading, pageNo, pageSize, olderLoading, filter, totalElements, currentDate, OrderDetailVisibility, data, loaderVisibility } = useSelector((state) => {
        return {
            orders: state.dailyOrders.orders,
            loading: state.dailyOrders.loading,
            pageNo: state.dailyOrders.pageNo,
            pageSize: state.dailyOrders.pageSize,
            olderLoading: state.dailyOrders.loadingOlderData,
            filter: state.dailyOrders.filter,
            totalElements: state.dailyOrders.totalElements,
            currentDate: state.dailyOrders.currentOrderDate,
            data: state.dailyOrders.currentOrder,
            OrderDetailVisibility: state.dailyOrders.OrderDetailVisibility,
            loaderVisibility: state.dailyOrders.loaderVisibility
        }
    }
    );

    const [isFood, setIsFood] = useState(false);

    const onClose = () => {
        dispatch(setOrderDetailVisibility(false));
    }

    let active = 0;
    switch (data?.status) {
        case DailyOrderEnum.IN_PROGRESS.name:
            active = 0;
            break;
        case DailyOrderEnum.SENT.name:
            active = 1;
            break;
        case DailyOrderEnum.DELIVERED.name:
            active = 2;
            break;
        default:
            active = -1
    }
    let total = 0;
    let foodElements = []

    {
        (data?.dailyOrderFoods || []).map((order, idx) => {
            if (!order.free) {
                total = total + parseFloat(order?.totalPrice);
            }
            foodElements.push(
                <View key={`dailyOrderFoods-${idx}`} >
                    <View style={{ marginTop: 30 }}>
                        <View style={{ flexDirection: "row", marginBottom: 30 }}>
                            <Typography variant="title" style={{ fontSize: 17 }} >{"Food : "}</Typography>
                            <Typography variant="subTitle" style={{ marginLeft: 20 }} numberOfLines={1} >{order?.food?.label}</Typography>
                        </View>
                        <View style={{ flexDirection: "row", marginBottom: 30 }}>
                            <Typography variant="title" style={{ fontSize: 17 }} >{"Quantity : "}</Typography>
                            <Typography variant="subTitle" style={{ marginLeft: 20 }} numberOfLines={1} >{order?.quantity}</Typography>
                        </View>
                        <View style={{ flexDirection: "row", marginBottom: 30 }}>
                            <Typography variant="title" style={{ fontSize: 17 }} >{"Unit Price : "}</Typography>
                            <Typography variant="subTitle" style={{ marginLeft: 20 }} numberOfLines={1} >{order?.price}</Typography>
                        </View>
                        <View style={{ flexDirection: "row", marginBottom: 30 }}>
                            <Typography variant="title" style={{ fontSize: 17 }} >{"Total Price : "}</Typography>
                            <Typography variant="subTitle" style={{ marginLeft: 20 }} numberOfLines={1} >{order?.totalPrice}</Typography>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Typography variant="title" style={{ fontSize: 17 }} >{"Free : "}</Typography>
                            <Typography variant="subTitle" style={{ marginLeft: 20 }} numberOfLines={1} >{order?.free ? "YES" : "NO"}</Typography>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }} >
                        <Typography>......</Typography>
                    </View>
                </View>
            )
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography>Order Details</Typography>
                <IconButton onPress={onClose} >
                    <FontAwesome
                        name="close"
                        size={17}
                        color={'gray'}
                    ></FontAwesome>
                </IconButton>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={{ maringLeft: 0, marginRight: 0, marginTop: 40 }}>
                    <Stepper
                        active={active}
                        contents={[{
                            title: "IN PROGRESS",
                            color: "#eaaa37"
                        }, {
                            title: "SENT",
                            color: "#4eac6d"
                        }, {
                            title: "DELIVERED",
                            color: "#212529"
                        }]} />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30 }}>
                    <Button title="Export" onPress={() => { onExport(data?.id) }} icon="file-export" style={{ backgroundColor: "#4eac6d" }} />
                    <Button disabled={DailyOrderEnum.DELIVERED.name === data?.status || DailyOrderEnum.CANCELED.name === data?.status} title="Next Step" onPress={() => { onNextStep(data?.id) }} isEndIcon={true} icon="arrow-right" color="#212529" style={{ backgroundColor: "#212529" }} />
                    <Button disabled={DailyOrderEnum.DELIVERED.name === data?.status || DailyOrderEnum.CANCELED.name === data?.status} title="Cancel" onPress={() => { onCancel(data?.id) }} icon="trash" color="#FF0000" textColor="black" style={{ backgroundColor: "#FF0000" }} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 30 }}>
                    <Typography variant="title" style={{ fontSize: 25 }} >{"Invoice"}</Typography>
                    <Typography variant="title"  ></Typography>
                    <IconButton style={{ backgroundColor: "#212529" }} onPress={() => { }}>
                        <FontAwesome5
                            name={"file"}
                            size={17}
                            color={"white"}
                        ></FontAwesome5>
                    </IconButton>
                </View>
                <View style={{ marginTop: 30 }}>
                    <View style={{ flexDirection: "row", marginBottom: 30 }}>
                        <Typography variant="title" style={{ fontSize: 17 }} >{"Invoice number : "}</Typography>
                        <Typography variant="subTitle" style={{ marginLeft: 20 }} numberOfLines={1} >{data?.orderNumber}</Typography>
                    </View>
                    <View style={{ flexDirection: "row", marginBottom: 30 }}>
                        <Typography variant="title" style={{ fontSize: 17 }} >{"Date : "}</Typography>
                        <Typography variant="subTitle" style={{ marginLeft: 20 }} numberOfLines={1} >{data?.date}</Typography>
                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="title" style={{ fontSize: 25 }} >{isFood ? `Foods (Total = ${total} aed)` : "Client"}</Typography>
                    <Typography variant="title"  ></Typography>
                    <IconButton style={{ backgroundColor: "#4eac6d" }} onPress={() => setIsFood(!isFood)}>
                        <FontAwesome5
                            name={isFood ? "arrow-left" : "arrow-right"}
                            size={17}
                            color={"white"}
                        ></FontAwesome5>
                    </IconButton>
                </View>
                {!isFood ?
                    <>
                        <View style={{ marginTop: 30 }}>
                            <View style={{ flexDirection: "row", marginBottom: 30 }}>
                                <Typography variant="title" style={{ fontSize: 17 }} >{"Name : "}</Typography>
                                <Typography variant="subTitle" style={{ marginLeft: 20 }} numberOfLines={1} >{data?.client?.name}</Typography>
                            </View>
                            <View style={{ flexDirection: "row", marginBottom: 30 }}>
                                <Typography variant="title" style={{ fontSize: 17 }} >{"Firstname : "}</Typography>
                                <Typography variant="subTitle" style={{ marginLeft: 20 }} numberOfLines={1} >{data?.client?.firstname}</Typography>
                            </View>
                            <View style={{ flexDirection: "row", marginBottom: 30 }}>
                                <Typography variant="title" style={{ fontSize: 17 }} >{"Adress : "}</Typography>
                                <Typography variant="subTitle" style={{ marginLeft: 20 }} numberOfLines={1} >{data?.client?.adress}</Typography>
                            </View>
                            <View style={{ flexDirection: "row", marginBottom: 30 }}>
                                <Typography variant="title" style={{ fontSize: 17 }} >{"Contact : "}</Typography>
                                <Typography variant="subTitle" style={{ marginLeft: 20 }} numberOfLines={1} >{data?.client?.contact}</Typography>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 0 }}>
                            <Typography variant="title" style={{ fontSize: 20 }} >{"Created By"}</Typography>
                            <Typography variant="title"  ></Typography>
                            <IconButton style={{ backgroundColor: "#212529" }} onPress={() => { }}>
                                <FontAwesome5
                                    name={"user"}
                                    size={17}
                                    color={"white"}
                                ></FontAwesome5>
                            </IconButton>
                        </View>
                        <View style={{ marginTop: 30 }}>
                            <View style={{ flexDirection: "row", marginBottom: 30 }}>
                                <Typography variant="title" style={{ fontSize: 17 }} >{"Name : "}</Typography>
                                <Typography variant="subTitle" style={{ marginLeft: 20 }} numberOfLines={1} >{data?.creator?.name}</Typography>
                            </View>
                            <View style={{ flexDirection: "row", marginBottom: 30 }}>
                                <Typography variant="title" style={{ fontSize: 17 }} >{"Firstname : "}</Typography>
                                <Typography variant="subTitle" style={{ marginLeft: 20 }} numberOfLines={1} >{data?.creator?.firstName}</Typography>
                            </View>
                        </View>
                    </> : <>
                        {foodElements}
                    </>}
            </ScrollView>
        </View >
    )
}

export default DetailOrder;