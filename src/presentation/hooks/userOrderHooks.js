import { ToastAndroid, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ShareBlobFile from '../../common/utils/share/ShareBlobFile'
import DailyOrderEnum from '../../data/constant/DailyOrderEnum';
import useDailyOrder from '../../service/applicable/order.sa/Order.sa';
import {
    setDailyOrders, addDailyOrders,
    setIsDailyOrdersLoading, setPageNo,
    setTotalElements, setCurrentOrderDate,
    setHomeOrder, setHomeOrderLoading, setIsDailyOlderOrdersLoading,
    setLoaderVisibility, setCurrentOrder
} from '../../service/applicable/order.sa/Order.redux.sa';
import useFoodHooks from './useFoodHooks';

const useOrderHooks = () => {

    const dispatch = useDispatch();
    const { getFood } = useFoodHooks();
    const { add, get, exportOrder, nextStepOrder, cancelOrder } = useDailyOrder();

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

    const getHomeOrder = (_callback = () => { }) => {
        dispatch(setHomeOrderLoading(true));
        get(0, 6, { status: DailyOrderEnum.IN_PROGRESS.name })
            .then((result) => {
                if (result?.data.length === 0) {
                    get(0, 6, { status: DailyOrderEnum.ALL.name })
                        .then((res) => {
                            dispatch(setHomeOrder(res?.data || []));
                            dispatch(setHomeOrderLoading(false));
                            _callback();
                        })
                        .catch((error) => {
                            dispatch(setHomeOrder([]));
                            dispatch(setHomeOrderLoading(false));
                            ToastAndroid.show("Error while getting orders from server, please try again :(", ToastAndroid.LONG);
                        })

                } else {
                    dispatch(setHomeOrder(result?.data || []));
                    dispatch(setHomeOrderLoading(false));
                }
            })
            .catch((error) => {
                dispatch(setHomeOrder([]));
                dispatch(setHomeOrderLoading(false));
                ToastAndroid.show("Error while getting orders from server, please try again :(", ToastAndroid.LONG);
            })
    }

    const getDailyOrders = (status, _callback = () => { }) => {
        dispatch(setIsDailyOrdersLoading(true));
        if (!status) {
            status = filter?.status;
        }
        get(0, pageSize, { status: status })
            .then((result) => {
                dispatch(setDailyOrders(result?.data || []));
                dispatch(setPageNo(0));
                dispatch(setCurrentOrderDate(result?.currentDate));
                dispatch(setTotalElements(result?.paginationInfo?.totalElements || 0));
                _callback();
                dispatch(setIsDailyOrdersLoading(false));
            })
            .catch((error) => {
                dispatch(setDailyOrders([]));
                dispatch(setPageNo(0));
                dispatch(setIsDailyOrdersLoading(false));
                ToastAndroid.show("Error while getting orders from server, please try again :(", ToastAndroid.LONG);
            })
    }

    const onAddOlderOrder = (status, _callback = () => { }) => {
        if (!status) {
            status = filter?.status;
        }
        dispatch(setIsDailyOlderOrdersLoading(true));
        get(pageNo + 1, pageSize, { status: status })
            .then((result) => {
                dispatch(addDailyOrders(result?.data || []));
                dispatch(setTotalElements(result?.paginationInfo?.totalElements || 0));
                dispatch(setPageNo(pageNo + 1));
                dispatch(setIsDailyOlderOrdersLoading(false));
                _callback();
            })
            .catch((error) => {
                dispatch(setIsDailyOlderOrdersLoading(false));
                ToastAndroid.show("Error while getting orders from server, please refresh the list :(", ToastAndroid.LONG);
            })
    }

    const onExport = (id, index, _callback = () => { }) => {
        dispatch(setLoaderVisibility({
            visible: true,
            text: "Export in progress..."
        }))
        exportOrder(id).then(async (result) => {
            await ShareBlobFile(result.blob, result.filename, () => {
                dispatch(setLoaderVisibility({
                    visible: false,
                    text: ""
                }));
                ToastAndroid.show("Order successfully exported! :)", ToastAndroid.SHORT)
                _callback();
            });
        }).catch((error) => {
            dispatch(setLoaderVisibility({
                visible: false,
                text: ""
            }));
            ToastAndroid.show("Error when exporting order, please try again ! :(", ToastAndroid.SHORT)
        })
    }

    const onNextStep = (id, index, _callback = () => { }) => {
        Alert.alert(
            "Please notice that this action is irreversible",
            "Do you really want to update this order to the next order step ?",
            [
                {
                    text: "No",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => {
                        dispatch(setLoaderVisibility({
                            visible: true,
                            text: "Please wait some seconds to update your order step..."
                        }));
                        nextStepOrder(id)
                            .then((result) => {
                                dispatch(setLoaderVisibility({
                                    visible: false,
                                    text: ""
                                }));
                                dispatch(setCurrentOrder(result?.data));
                                getDailyOrders()
                                getHomeOrder();
                                getFood();
                                _callback();
                            })
                            .catch((error) => {
                                dispatch(setLoaderVisibility({
                                    visible: false,
                                    text: ""
                                }));
                                ToastAndroid.show("Error when attempting to update the order step, please try again ! :(", ToastAndroid.SHORT)
                            })
                    }
                }
            ]
        )
    }

    const onCancel = (id, index, _callback = () => { }) => {
        Alert.alert(
            "Please notice that this action is irreversible",
            "Do you really want to cancel this order ?",
            [
                {
                    text: "No",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => {
                        dispatch(setLoaderVisibility({
                            visible: true,
                            text: "Please wait some seconds to cancel the order..."
                        }));
                        cancelOrder(id)
                            .then((result) => {
                                dispatch(setLoaderVisibility({
                                    visible: false,
                                    text: ""
                                }));
                                dispatch(setCurrentOrder(result?.data));
                                getDailyOrders();
                                getHomeOrder();
                                getFood();
                                _callback();
                            })
                            .catch((error) => {
                                dispatch(setLoaderVisibility({
                                    visible: false,
                                    text: ""
                                }));
                                ToastAndroid.show("Error when attempting to update the order step, please try again ! :(", ToastAndroid.SHORT)
                            })
                    }
                }
            ]
        )
    }

    return { getHomeOrder, getDailyOrders, onAddOlderOrder, onNextStep, onExport, onCancel };
}

export default useOrderHooks;