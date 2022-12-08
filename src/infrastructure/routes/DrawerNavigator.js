import React, { useEffect } from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useSelector } from 'react-redux';

import { useWebSocketListener } from '../../service/applicable/listener.sa/WebSocket.listener.sa';

import UserRole from '../../data/constant/UserRole';
import BottomNavigator from './BottomNavigator';
import Sidebar from '../../presentation/layouts/sidebar';
import Notification from '../../presentation/pages/Notification';
import Stock from '../../presentation/pages/Stock';
import Invoice from '../../presentation/pages/InvoiceViewer';
import Users from '../../presentation/pages/Users';
import Search from '../../presentation/pages/Search';
import NotificationTypeEnum from '../../data/constant/NotificationTypeEnum';
import * as Notifications from 'expo-notifications';
import useOrderHooks from '../../presentation/hooks/userOrderHooks';
import useFoodHooks from '../../presentation/hooks/useFoodHooks';
import useNotificationHooks from '../../presentation/hooks/useNotificationHooks';
import Typography from '../../presentation/components/Typography';
import Historic from '../../presentation/pages/Historic';

const styles = StyleSheet.create({
    flat: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    innerContainer: {
        position: 'absolute',
        right: -10,
        top: -6,
        minWidth: 20,
        backgroundColor: '#FF0000',
        borderRadius: 10,
        padding: 2,
        justifyContent: 'center',
        alignItems: "center",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6.0,
        elevation: 2,
    },
    badgeText: {
        fontFamily: "Nunito-Bold",
        color: "#ffffff",
        fontSize: 11
    }
})

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const { getHomeOrder, getDailyOrders } = useOrderHooks();
    const { getFood } = useFoodHooks();
    const { getNotificationsNumber, getNotifications } = useNotificationHooks();
    const { roleName, badge, isNotificationScreen } = useSelector((state) => {
        return {
            roleName: state.auth.roleName,
            badge: state.notification.numberOfNotification,
            isNotificationScreen: state.notification.isNotificationScreen
        }
    });

    const formatBadge = (numberForBadge) => {
        if (`${numberForBadge}`.length > 2) return "99+";
        return numberForBadge;
    }

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true
        })
    });

    const patchNotification = (title, message) => {
        Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: message
            },
            trigger: null
        })
    }

    useWebSocketListener((data) => {
        const title = data?.title;
        const message = data?.message;
        const notificationType = data?.notificationType;


        getNotificationsNumber();
        if (isNotificationScreen) {
            getNotifications();
        }
        switch (notificationType) {
            case NotificationTypeEnum.ADD_ORDER.name:
                getDailyOrders();
                getHomeOrder();
                patchNotification(title, message);
                break;
            case NotificationTypeEnum.SENT_ORDER.name:
                getDailyOrders();
                getHomeOrder();
                getFood();
                patchNotification(title, message);
                break;
            case NotificationTypeEnum.DELIVERED_ORDER:
                getDailyOrders();
                getHomeOrder();
                getFood();
                patchNotification(title, message);
                break;
            case NotificationTypeEnum.CANCEL_ORDER.name:
                getDailyOrders();
                getHomeOrder();
                getFood();
                patchNotification(title, message);
                break;
            default:
                if (roleName === UserRole.SUPER_ADMIN.name || roleName === UserRole.ADMIN.name) {
                    patchNotification(title, message);
                }
                return;
        }
    });

    useEffect(() => {
        getNotificationsNumber();
    }, [])

    return (
        <Drawer.Navigator
            drawerContent={(props) => <Sidebar {...props} />}
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: '#4eac6d',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#333',
                drawerLabelStyle: {
                    marginLeft: -15,
                    fontFamily: 'Nunito-Bold',
                    fontSize: 15,
                },
            }}
            initialRouteName="Home">
            <Drawer.Screen name="Home"
                component={BottomNavigator}
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="home" size={22} color={color} />
                    ),
                }}
            />
            <Drawer.Screen name="Search"
                component={Search}
                options={{
                    drawerIcon: ({ color }) => (
                        <FontAwesome name="search" size={22} color={color} />
                    ),
                }}
            />
            <Drawer.Screen name="Notification"

                component={Notification}
                options={{
                    drawerIcon: ({ color }) => (
                        <View style={styles.flat} >
                            {badge !== 0 ?
                                (<View style={styles.innerContainer}>
                                    <Typography style={styles.badgeText}>
                                        {formatBadge(badge)}
                                    </Typography>
                                </View>) : <></>}
                            <Ionicons name="notifications" size={22} color={color} />
                        </View>
                    ),

                }}
            />

            {
                UserRole.ADMIN.name === roleName || UserRole.SUPER_ADMIN.name === roleName ? (
                    <>
                        <Drawer.Screen name="Stock"
                            component={Stock}
                            options={{
                                drawerIcon: ({ color }) => (
                                    <Ionicons name="cart-sharp" size={22} color={color} />
                                ),
                            }}
                        />
                        <Drawer.Screen name="Invoice"
                            component={Invoice}
                            options={{
                                drawerIcon: ({ color }) => (
                                    <FontAwesome5 name="file-invoice-dollar" size={20} color={color} />
                                ),
                            }}
                        />
                        <Drawer.Screen name="Users"
                            component={Users}
                            options={{
                                drawerIcon: ({ color }) => (
                                    <FontAwesome5 name="users" size={20} color={color} />
                                ),
                            }}
                        />
                        <Drawer.Screen name="Historic"

                            component={Historic}
                            options={{
                                drawerIcon: ({ color }) => (
                                    <View style={styles.flat} >
                                        <FontAwesome5 name="history" size={20} color={color} />
                                    </View>
                                ),

                            }}
                        />
                    </>
                ) : <></>
            }
        </Drawer.Navigator>
    );
}

export default DrawerNavigator;