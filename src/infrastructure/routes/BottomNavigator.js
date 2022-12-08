import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState, useEffect } from 'react';
import { Animated, Dimensions, Image, Platform, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import plus from '../../../assets/plus.png';
import { FontAwesome5 } from '@expo/vector-icons';

import { useSelector } from 'react-redux';

import Home from '../../presentation/pages/Home';
import AddOrder from '../../presentation/pages/Order/add';
import Order from '../../presentation/pages/Order';
import DetailOrder from '../../presentation/pages/Order/detail';
import Typography from '../../presentation/components/Typography';
import Profile from '../../presentation/pages/Profile';
import Event from '../../presentation/pages/Event';

const Tab = createBottomTabNavigator();

const getWidth = () => {
    let width = Dimensions.get("window").width
    width = width - 80
    return width / 5
}

const EmptyScreen = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        </View>
    );
}

const BottomNavigator = () => {

    const { OrderDetailVisibility, loaderVisibility } = useSelector((state) => {
        return {
            OrderDetailVisibility: state.dailyOrders.OrderDetailVisibility,
            loaderVisibility: state.dailyOrders.loaderVisibility
        }
    }
    );

    const tabOffsetValue = useRef(new Animated.Value(0)).current;

    const [visibility, setVisibility] = useState(false);

    return (
        <>
            <StatusBar style="auto" />
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#212529',
                        position: 'absolute',
                        bottom: 10,
                        marginHorizontal: 20,
                        height: 60,
                        borderRadius: 10,
                        shadowOffset: {
                            width: 0,
                            height: 6,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 6.0,
                        elevation: 2,
                        paddingHorizontal: 20,
                    },
                    tabBarShowLabel: false
                }}>


                <Tab.Screen name={"Home1"} component={Home} options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            // centring Tab Button...
                            position: 'absolute',
                            top: 20
                        }}>
                            <FontAwesome5
                                name="home"
                                size={20}
                                color={focused ? '#4eac6d' : 'gray'}
                            ></FontAwesome5>
                        </View>
                    )
                }} listeners={({ navigation, route }) => ({
                    // Onpress Update....
                    tabPress: e => {
                        Animated.spring(tabOffsetValue, {
                            toValue: 0,
                            useNativeDriver: true
                        }).start();
                    }
                })}></Tab.Screen>

                <Tab.Screen name={"Order"} component={Order} options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            // centring Tab Button...
                            position: 'absolute',
                            top: 20
                        }}>
                            <FontAwesome5
                                name="clipboard-list"
                                size={20}
                                color={focused ? '#4eac6d' : 'gray'}
                            ></FontAwesome5>
                        </View>
                    )
                }} listeners={({ navigation, route }) => ({
                    // Onpress Update....
                    tabPress: e => {
                        Animated.spring(tabOffsetValue, {
                            toValue: getWidth(),
                            useNativeDriver: true
                        }).start();
                    }
                })}></Tab.Screen>

                <Tab.Screen name={"ActionButton"} component={EmptyScreen} options={{
                    tabBarIcon: ({ focused }) => (

                        <TouchableOpacity onPress={() => {
                            setVisibility(true)
                        }} >
                            <View style={{
                                width: 55,
                                height: 55,
                                backgroundColor: '#4eac6d',
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: Platform.OS == "android" ? 50 : 30
                            }}>
                                <Image source={plus} style={{
                                    width: 22,
                                    height: 22,
                                    tintColor: 'white',
                                }}></Image>
                            </View>
                        </TouchableOpacity>
                    )
                }}></Tab.Screen>

                <Tab.Screen name={"Event"} component={Event} options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            // centring Tab Button...
                            position: 'absolute',
                            top: 20
                        }}>
                            <FontAwesome5
                                name="bookmark"
                                size={20}
                                color={focused ? '#4eac6d' : 'gray'}
                            ></FontAwesome5>
                        </View>
                    )
                }} listeners={({ navigation, route }) => ({
                    // Onpress Update....
                    tabPress: e => {
                        Animated.spring(tabOffsetValue, {
                            toValue: getWidth() * 3,
                            useNativeDriver: true
                        }).start();
                    }
                })}></Tab.Screen>

                <Tab.Screen name={"User"} component={Profile} options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            // centring Tab Button...
                            position: 'absolute',
                            top: 20
                        }}>
                            <FontAwesome5
                                name="user-tie"
                                size={20}
                                color={focused ? '#4eac6d' : 'gray'}
                            ></FontAwesome5>
                        </View>
                    )
                }} listeners={({ navigation, route }) => ({
                    // Onpress Update....
                    tabPress: e => {
                        Animated.spring(tabOffsetValue, {
                            toValue: getWidth() * 4,
                            useNativeDriver: true
                        }).start();
                    }
                })}></Tab.Screen>

            </Tab.Navigator >

            <Animated.View style={{
                width: getWidth() - 20,
                height: 4,
                backgroundColor: '#ffffff',
                position: 'absolute',
                bottom: 68,
                // Horizontal Padding = 20...
                left: 50,
                borderRadius: 20,
                transform: [
                    { translateX: tabOffsetValue }
                ]
            }}>

            </Animated.View>

            <Modal visible={visibility} >
                <AddOrder onClose={() => setVisibility(false)} />
            </Modal>
            <Modal visible={OrderDetailVisibility}  >
                <DetailOrder />
            </Modal>
            <Modal visible={loaderVisibility.visible} >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginHorizontal: 20 }}>
                    <ActivityIndicator size="large" color="#4eac6d" />
                    <Typography>{loaderVisibility.text}</Typography>
                </View>
            </Modal>
        </>
    );
}

export default BottomNavigator;

