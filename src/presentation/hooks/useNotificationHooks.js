import { ToastAndroid, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    setIsLoadingNotification, setNotifications,
    setNumberOfNotification, setPageNo, setPageSize,
    setTotalElements
} from '../../service/applicable/notification.sa/Notification.redux.sa';
import useNotification from '../../service/applicable/notification.sa/Notification.sa';

const useNotificationHooks = () => {
    const dispatch = useDispatch();
    const { pageNo, pageSize } = useSelector((state) => {
        return {
            pageNo: state.notification.pageNo,
            pageSize: state.notification.pageSize
        }
    }
    );

    const { getUserNotification, getUserNotificationNumber } = useNotification();


    const getOlderNotifications = () => {
        getUserNotification(pageNo + 1, pageSize)
            .then((result) => {
                dispatch(setNotifications(result?.data || []));
                dispatch(setIsLoadingNotification(false));
                dispatch(setPageNo(pageNo + 1));
            })
            .catch((error) => {
                dispatch(setIsLoadingNotification(false));
                ToastAndroid.show("Error while getting notification from server, please try again :(", ToastAndroid.LONG);
            })
    }

    const getNotificationsNumber = () => {
        getUserNotificationNumber()
            .then((result) => {
                dispatch(setNumberOfNotification(result?.data || 0));
            })
            .catch((error) => {
                ToastAndroid.show("Error while getting notification from server, please try again :(", ToastAndroid.LONG);
            })
    }

    const getNotifications = () => {
        dispatch(setIsLoadingNotification(true));
        getUserNotification(0, pageSize)
            .then((result) => {
                dispatch(setNotifications(result?.data || []));
                dispatch(setIsLoadingNotification(false));
                dispatch(setTotalElements(result?.paginationInfo?.totalElements || 0));
                getNotificationsNumber();
            })
            .catch((error) => {
                dispatch(setIsLoadingNotification(false));
                ToastAndroid.show("Error while getting notification from server, please try again :(", ToastAndroid.LONG);
            })
    }


    return { getNotifications, getOlderNotifications, getNotificationsNumber }

}

export default useNotificationHooks;