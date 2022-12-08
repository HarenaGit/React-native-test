import React, { useState } from 'react';
import { ActivityIndicator, ToastAndroid, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import IconButton from '../../components/IconButton';
import Typography from '../../components/Typography';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';

import useDailyOrder from '../../../service/applicable/order.sa/Order.sa';
import addDailyOrderConverter from '../../../constraint/converter/addDailyOrder.converter';

import ShareBlobFile from '../../../common/utils/share/ShareBlobFile'
import {
    setDailyOrders, addDailyOrders,
    setIsDailyOrdersLoading, setPageNo,
    setTotalElements, setCurrentOrderDate,
    setHomeOrder, setHomeOrderLoading
} from '../../../service/applicable/order.sa/Order.redux.sa';
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

const AddOrder = ({ onClose = () => { } }) => {

    const { getHomeOrder, getDailyOrders } = useOrderHooks();

    const { orders, loading, pageNo, pageSize, filter } = useSelector((state) => {
        return {
            orders: state.dailyOrders.orders,
            loading: state.dailyOrders.loading,
            pageNo: state.dailyOrders.pageNo,
            pageSize: state.dailyOrders.pageSize,
            filter: state.dailyOrders.filter
        }
    }
    );

    const [dailyOrderData, setDailyOrderData] = useState({
        client: {
            adress: "",
            contact: "",
            firstname: "",
            name: ""
        },
        order: [{
            label: "",
            free: false,
            price: "0",
            quantity: "0",
            totalPrice: "0"
        }]
    });

    const { add, get } = useDailyOrder();

    const [isFood, setIsFood] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const onClientChange = (event, name) => {
        const value = event;
        switch (name) {
            case "client.name":
                setDailyOrderData({
                    ...dailyOrderData,
                    client: {
                        ...dailyOrderData.client,
                        name: value
                    }
                })
                break;
            case "client.firstname":
                setDailyOrderData({
                    ...dailyOrderData,
                    client: {
                        ...dailyOrderData.client,
                        firstname: value
                    }
                })
                break;
            case "client.adress":
                setDailyOrderData({
                    ...dailyOrderData,
                    client: {
                        ...dailyOrderData.client,
                        adress: value
                    }
                })
                break;
            case "client.contact":
                setDailyOrderData({
                    ...dailyOrderData,
                    client: {
                        ...dailyOrderData.client,
                        contact: value
                    }
                })
                break;
            default:
                return;
        }
    }

    const onOrderFoodChange = (event, index, name) => {
        const value = event;
        let dailyOrders = dailyOrderData.order;
        let dailyOrdresFiltered = dailyOrders.map((order, idx) => {
            if (idx == index) {
                switch (name) {
                    case "order.free":
                        order.free = !order.free;
                        break;
                    case "order.food.label":
                        order.label = value;
                        break;
                    case "order.quantity":
                        order.quantity = value;
                        if (value !== "" && value !== undefined) {
                            let totalPrice = parseFloat(order.price) * parseFloat(value);
                            order.totalPrice = `${totalPrice}`;
                        } else {
                            order.totalPrice = "";
                        }
                        break;
                    case "order.price":
                        order.price = value;
                        if (value !== "" && value !== undefined) {
                            let price = parseFloat(value) * parseFloat(order.quantity);
                            order.totalPrice = `${price}`;
                        } else {
                            order.totalPrice = "";
                        }
                        break;
                    case "order.totalPrice":
                        order.totalPrice = value;
                        break;
                    default:
                        return;
                }
            }
            return order;
        })
        setDailyOrderData({ ...dailyOrderData, order: dailyOrdresFiltered });
    }

    const onOrderFoodDelete = (index) => {
        let dailyOrders = dailyOrderData.order;
        if (dailyOrders.length <= 1) {
            Alert.alert("Note ", "Can not delete those entries because you need to specify at list one order food");
            return;
        };
        let dailyOrdresFiltered = dailyOrders.filter((val, idx) => idx !== index);
        setDailyOrderData({ ...dailyOrderData, order: dailyOrdresFiltered });
    }

    const onOrderFoodAdd = () => {
        setDailyOrderData({
            ...dailyOrderData,
            order:
                [
                    {
                        label: "",
                        free: false,
                        price: "0",
                        quantity: "0",
                        totalPrice: "0"
                    },
                    ...dailyOrderData.order
                ]
        });
    }

    const onSave = () => {
        setIsLoading(true);
        let dataDAO = addDailyOrderConverter.toPostDAO(dailyOrderData);
        add(dataDAO)
            .then(async (result) => {
                await ShareBlobFile(result.blob, result.filename, async () => {
                    setDailyOrderData({
                        client: {
                            adress: "",
                            contact: "",
                            firstname: "",
                            name: ""
                        },
                        order: [{
                            label: "",
                            free: false,
                            price: "0",
                            quantity: "0",
                            totalPrice: "0"
                        }]
                    });
                    setIsLoading(false);
                    onClose();
                    getDailyOrders();
                    getHomeOrder();
                    ToastAndroid.show("Order successfully added! :)", ToastAndroid.SHORT)
                });
            })
            .catch((error) => {
                setIsLoading(false);
                ToastAndroid.show(
                    "Error, please try again and verify your connection or you need to disconnect and reconnect to the application :( ",
                    ToastAndroid.LONG
                );
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography>New Order</Typography>
                <IconButton onPress={onClose} >
                    <FontAwesome
                        name="close"
                        size={17}
                        color={'gray'}
                    ></FontAwesome>
                </IconButton>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20, marginBottom: 20 }}>
                <Typography variant="title" style={{ fontSize: 20 }} >{isFood ? "Food" : "Client"}</Typography>
                <Typography variant="title" style={{ fontSize: 20 }} >---</Typography>
                <IconButton style={{ backgroundColor: "#4eac6d" }} onPress={() => setIsFood(!isFood)}>
                    <FontAwesome5
                        name={isFood ? "arrow-left" : "arrow-right"}
                        size={17}
                        color={"white"}
                    ></FontAwesome5>
                </IconButton>
            </View>
            {isLoading ? <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
                <ActivityIndicator size="large" color="#4eac6d" />
            </View> :
                <ScrollView
                    keyboardShouldPersistTaps='always'
                    showsVerticalScrollIndicator={false} >
                    {!isFood ? <View style={styles.clientInfo}>
                        <Input label="Name : " value={dailyOrderData.client.name} onChangeText={(e) => onClientChange(e, "client.name")} />
                        <Input label="First Name : " value={dailyOrderData.client.firstname} onChangeText={(e) => onClientChange(e, "client.firstname")} />
                        <Input label="Adress : " value={dailyOrderData.client.adress} onChangeText={(e) => onClientChange(e, "client.adress")} />
                        <Input label="Contact : " value={dailyOrderData.client.contact} onChangeText={(e) => onClientChange(e, "client.contact")} />
                    </View> :
                        <View>
                            <IconButton style={{ backgroundColor: "#4eac6d" }} onPress={onOrderFoodAdd}>
                                <FontAwesome5
                                    name={"plus"}
                                    size={17}
                                    color={"white"}
                                ></FontAwesome5>
                            </IconButton>
                            {(dailyOrderData.order || []).map((value, index) => {
                                return (
                                    <View key={`index-${index}`} style={{ marginBottom: 20 }} >
                                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                            <CheckBox label="Free : " onValueChange={() => onOrderFoodChange(null, index, "order.free")} value={value.free} />
                                            <Input label="Food Name : " onChangeText={(e) => onOrderFoodChange(e, index, "order.food.label")} value={value.label} style={{ marginLeft: 20 }} />
                                            <Input label="Quantity : " keyboardType="numeric" onChangeText={(e) => onOrderFoodChange(e, index, "order.quantity")} value={value.quantity} style={{ marginLeft: 10 }} />

                                            <TouchableOpacity onPress={() => onOrderFoodDelete(index)}>
                                                <FontAwesome5
                                                    name={"trash"}
                                                    size={17}
                                                    color={"black"}
                                                ></FontAwesome5>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "center" }} >
                                            <Input label="Unit Price : " keyboardType="numeric" onChangeText={(e) => onOrderFoodChange(e, index, "order.price")} value={value.price} style={{ marginLeft: 52 }} />
                                            <Input label="Total Price : " keyboardType="numeric" onChangeText={(e) => onOrderFoodChange(e, index, "order.totalPrice")} value={value.totalPrice} style={{ marginLeft: 10, marginRight: 15 }} />
                                        </View>
                                    </View>
                                )
                            })}
                        </View>}
                    <Button title="Save" onPress={onSave} icon="save" style={{ marginTop: 20, marginBottom: 20 }} />
                </ScrollView >
            }

        </View >
    )
}

export default AddOrder;