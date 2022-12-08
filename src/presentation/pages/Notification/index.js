import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { setNotificationScreen } from '../../../service/applicable/notification.sa/Notification.redux.sa';

import Header from '../../layouts/header.v.1';
import useNotificationHooks from '../../hooks/useNotificationHooks';
import NotificationItem from '../../components/NotificationItem';
import Typography from '../../components/Typography';
import getCurrentColorNotif from '../../../common/color/Notification.color';
import isCloseToBottom from '../../../common/utils/IsScrollViewCloseReachedEnd';
import Button from '../../components/Button';


const Notification = () => {

    const focused = useIsFocused();
    const dispatch = useDispatch();

    const { isLoadingNotification, notifications, pageSize, totalElements } = useSelector((state) => {
        return {
            isLoadingNotification: state.notification.isLoadingNotification,
            notifications: state.notification.notifications,
            pageSize: state.notification.pageSize,
            totalElements: state.notification.totalElements
        }
    });

    const { getNotifications } = useNotificationHooks();

    useEffect(() => {
        dispatch(setNotificationScreen(focused));
        if (focused) {
            getNotifications();
        }
    }, [focused])


    return (
        <View style={{ flex: 1 }}>
            <Header title="Notification" />
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 25 }}>
                <Typography style={{ fontSize: 18, marginTop: 20, marginBottom: 5 }} variant={"subTitle"} >Not Seen</Typography>
            </View>
            {
                isLoadingNotification ? (
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#4eac6d" />
                    </View>
                ) : (
                    <View style={{ marginHorizontal: 20, flex: 1 }} >
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps='always'
                            data={[...notifications, { plusLoader: true }]}
                            keyExtractor={(item, index) => { return `indexNotificationScreen-${index}` }}
                            renderItem={({ index, item }) => {
                                if (item?.plusLoader) {
                                    return (
                                        <>
                                            {notifications.length < totalElements ?
                                                <View style={{ marginTop: 20, marginBottom: 20, alignItems: "center" }}>
                                                    <Button
                                                        onPress={() => { getNotifications(); }}
                                                        title="Show more"
                                                        variant="contained"
                                                        color="#4eac6d"
                                                        icon='chevron-down'
                                                    />
                                                </View> : <></>}
                                        </>
                                    )
                                }
                                return (
                                    <NotificationItem
                                        leftContainerColor={getCurrentColorNotif(item?.notificationType)}
                                        leftText={item?.notificationType}
                                        leftTextColor="#ffffff"
                                        title={item?.title}
                                        message={item?.message}
                                        date={item?.date}
                                        notificationType={item?.notificationType}
                                        notificationTypeColor={getCurrentColorNotif(item?.notificationType)}
                                    />
                                )
                            }}
                        />
                    </View>
                )
            }
        </View>
    );
}

export default Notification;