import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { setHistoricScreen } from '../../../service/applicable/historic.sa/Historic.redux.sa';

import Header from '../../layouts/header.v.1';
import useHistoricHooks from '../../hooks/useHistoricHooks';
import NotificationItem from '../../components/NotificationItem';
import Typography from '../../components/Typography';
import getCurrentColorNotif from '../../../common/color/Notification.color';
import Button from '../../components/Button';


const Historic = () => {

    const focused = useIsFocused();
    const dispatch = useDispatch();

    const { isLoadingHistoric, isLoadingOlderHistoric, historics, totalElements } = useSelector((state) => {
        return {
            isLoadingHistoric: state.actionHistoric.isLoadingHistoric,
            isLoadingOlderHistoric: state.actionHistoric.isLoadingOlderHistoric,
            historics: state.actionHistoric.historics,
            totalElements: state.actionHistoric.totalElements
        }
    }
    );

    const { getHistorics, getOlderHistorics } = useHistoricHooks();

    useEffect(() => {
        dispatch(setHistoricScreen(focused));
    }, [focused])

    useEffect(() => {
        getHistorics();
    }, [])


    return (
        <View style={{ flex: 1 }}>
            <Header title="Historic" includeSearch={true} onSearch={() => { Alert.alert("Oops!", "Search function not supported yet") }} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 25 }}>
                <Typography style={{ fontSize: 18, marginTop: 20, marginBottom: 5 }} variant={"subTitle"} >Total Elements : {`${totalElements}`}</Typography>
                <TouchableOpacity style={{ width: 50, height: 70, justifyContent: "center", alignItems: "center" }} onPress={() => getHistorics()}>
                    <Typography variant="title" style={{ fontSize: 16, color: "rgba(0,0,0,0.3)" }} >
                        <Ionicons
                            name="refresh"
                            size={17}
                            color={'rgba(0,0,0,0.8)'}
                        ></Ionicons>
                    </Typography>
                </TouchableOpacity>
            </View>
            {
                isLoadingHistoric ? (
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#4eac6d" />
                    </View>
                ) : (
                    <View style={{ marginHorizontal: 20, flex: 1 }} >
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps='always'
                            data={[...historics, { plusLoader: true }]}
                            keyExtractor={(item, index) => { return `indexHistoricScreen-${index}` }}
                            renderItem={({ index, item }) => {
                                if (item?.plusLoader) {
                                    return (
                                        <>
                                            {historics.length < totalElements ?
                                                <View style={{ marginTop: 20, marginBottom: 20, alignItems: "center" }}>
                                                    {
                                                        isLoadingOlderHistoric ?
                                                            <ActivityIndicator size="large" color="#4eac6d" /> :
                                                            <Button
                                                                onPress={() => { getOlderHistorics(); }}
                                                                title="Show more"
                                                                variant="contained"
                                                                color="#4eac6d"
                                                                icon='chevron-down'
                                                            />
                                                    }

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

export default Historic;