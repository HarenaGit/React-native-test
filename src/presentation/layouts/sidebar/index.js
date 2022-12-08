import React, { useState } from 'react';
import {
    View,
    Text,
    ImageBackground,
    Image,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    Alert
} from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { LinearGradient } from "expo-linear-gradient";

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { useDispatch } from 'react-redux';

import { resetAuth } from '../../../service/applicable/auth.sa/Auth.redux.sa';
import useAuth from '../../../service/applicable/auth.sa/Auth.sa';

import ImageSrc from '../../../data/constant/ImageSrc';

const Sidebar = props => {

    const dispatch = useDispatch();

    const { logout } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    const onLogout = () => {
        setIsLoading(true);
        setTimeout(() => {
            logout()
                .then(() => {
                    dispatch(resetAuth(true));
                })
                .catch(() => {
                    Alert.alert("Error", "Please try to sign out again :(");
                    setIsLoading(false);
                })
        }, 500);
    }

    return (
        <View style={{ flex: 1 }}>
            <Modal visible={isLoading} >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#4eac6d" />
                </View>
            </Modal>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ backgroundColor: '#4eac6d' }}>
                <ImageBackground
                    source={ImageSrc.sideBarBackground}
                    style={{ padding: 20 }}
                    blurRadius={1}
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                        style={{
                            width: '100%',
                            position: "relative"
                        }}>
                        <Image
                            source={ImageSrc.userImageMale}
                            style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }}
                        />
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 18,
                                fontFamily: 'Nunito-Bold',
                                marginBottom: 5,
                            }}
                            numberOfLines={1}
                        >
                            Ny Harena
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                style={{
                                    color: '#fff',
                                    fontFamily: 'Nunito-regular',
                                    marginRight: 5,
                                }}
                                numberOfLines={1}
                            >
                                ADMINISTRATOR
                            </Text>
                            <FontAwesome5 name="user" size={14} color="#fff" />
                        </View>
                    </LinearGradient>
                </ImageBackground>
                <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="share-social" size={22} />
                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: 'Nunito-regular',
                                marginLeft: 5,
                            }}>
                            MadaMeals informations
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={onLogout} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="exit" size={22} />
                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: 'Nunito-Bold',
                                marginLeft: 5,
                            }}>
                            Sign Out
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Sidebar;