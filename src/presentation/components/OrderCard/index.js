import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import ImageSrc from '../../../data/constant/ImageSrc';
import Typography from '../Typography';

import dailyOrderEnum from '../../../data/constant/DailyOrderEnum';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    overlay: {
        height: '100%',
        width: '100%',
        position: "relative"
    },
    status: {
        padding: 10,
        borderRadius: 4,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6.0,
        elevation: 2,
        position: "absolute",
        top: 10,
        left: 10,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 3
    },
    status_progress: {
        borderColor: "#eaaa37",
        backgroundColor: "#eaaa37",
    },
    status_sent: {
        backgroundColor: "#4eac6d",
        borderColor: "#4eac6d"
    },

    status_done: {
        backgroundColor: "#212529",
        borderColor: "#212529"
    },
    status_canceled: {
        backgroundColor: "#FF0000",
        borderColor: "#FF0000"
    },
    info: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "100%",
        justifyContent: "flex-end"
    },

})

const OrderCard = ({
    status = "in progress",
    title = "", subTitle = "",
    onStatus = () => { },
    onDetail = () => { },
    disabled = { detail: false, status: false, export: false, cancel: false }
}) => {

    let currentStatus = status;
    let currentStatusStyle = styles.status_progress;
    switch (status) {
        case dailyOrderEnum.IN_PROGRESS.name:
            currentStatus = dailyOrderEnum.IN_PROGRESS.title;
            currentStatusStyle = styles.status_progress;
            break;
        case dailyOrderEnum.SENT.name:
            currentStatus = dailyOrderEnum.SENT.title;
            currentStatusStyle = styles.status_sent;
            break;
        case dailyOrderEnum.DELIVERED.name:
            currentStatus = dailyOrderEnum.DELIVERED.title;
            currentStatusStyle = styles.status_done;
            break;
        case dailyOrderEnum.CANCELED.name:
            currentStatus = dailyOrderEnum.CANCELED.title;
            currentStatusStyle = styles.status_canceled;
            break;
        default:

    }
    return (

        <ImageBackground blurRadius={3} source={ImageSrc.orderCardBackground} style={styles.container} >
            <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                style={styles.overlay}>
                <TouchableOpacity disabled={disabled?.status} onPress={(e) => { onStatus(); }} style={[styles.status, currentStatusStyle]} >
                    <Typography style={{ fontSize: 18, color: "white" }} numberOfLines={1} >{currentStatus}</Typography>
                </TouchableOpacity>

                <TouchableOpacity disabled={disabled?.detail} onPress={() => { onDetail(); }} style={styles.info}>
                    <View style={{ marginBottom: 20, marginHorizontal: 10 }} >
                        <Typography style={{ color: "white" }} numberOfLines={1} >{title}</Typography>
                        <Typography
                            style={{ color: "white", fontFamily: "Nunito-regular", marginTop: 5 }}
                            numberOfLines={2}
                            variant="subtitle" >
                            {subTitle}
                        </Typography>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        </ImageBackground>
    )
}

export default OrderCard;