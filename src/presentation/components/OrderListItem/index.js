import React from 'react';
import { View, StyleSheet, ImageBackground, Animated, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { LinearGradient } from "expo-linear-gradient";
import ImageSrc from '../../../data/constant/ImageSrc';
import Typography from '../Typography';
import IconButton from '../IconButton';
import { FontAwesome5 } from '@expo/vector-icons';
import dailyOrderEnum from '../../../data/constant/DailyOrderEnum';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 82,
        borderRadius: 10,
        flexDirection: "row",
        marginBottom: 30,

    },
    imageContainer: {
        width: 90,
        height: 75,
        position: "relative",
        marginRight: 14
    },
    border: {
        borderColor: 'rgba(0,0,0,0.4)',
        borderStyle: 'dotted',
        borderWidth: 1,
        borderRadius: 1,
        height: 75,
        width: 1,
        position: "absolute",
        right: 0,
        top: 0
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 10,
        overflow: "hidden",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
        flexDirection: "column",
        marginRight: 10,
        flex: 1
    },
    status: {
        borderWidth: 2,
        borderStyle: "solid",
        width: 50,
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
    },
    overlay: {
        height: '100%',
        width: '100%',
        justifyContent: "center",
        alignItems: "center"
    },

    text_color_black: {
        color: "#000000"
    },

    text_color_white: {
        color: "#ffffff"
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
    }

});

const renderRightActions = (progress, dragX, onExport = () => { }, onCancel = () => { }, status, disabled) => {

    const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [150, 0],
    });

    return (
        <Animated.View style={{ flexDirection: "row", justifyContent: "center", marginLeft: 10, marginRight: 20, transform: [{ translateX: trans }] }} >
            <IconButton disabled={disabled?.export} style={{ backgroundColor: "#4eac6d" }} onPress={onExport}>
                <FontAwesome5
                    name="file-export"
                    size={17}
                    color={'rgba(0,0,0,0.8)'}
                >

                </FontAwesome5>
            </IconButton>
            <IconButton disabled={disabled?.cancel} style={{ backgroundColor: "#FF0000", marginLeft: 10 }} onPress={onCancel}>
                <FontAwesome5
                    name="trash"
                    size={17}
                    color={'rgba(0,0,0,0.8)'}
                >

                </FontAwesome5>
            </IconButton>
        </Animated.View >
    );
};

const OrderListItem = ({
    title = "", subTitle = "",
    status = dailyOrderEnum.IN_PROGRESS.name,
    onCancel = () => { }, onExport = () => { },
    onDetail = () => { }, onStatus = () => { },
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
        <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, onExport, onCancel, status, disabled)} >
            <View style={styles.container}>
                <View style={styles.imageContainer} >
                    <ImageBackground blurRadius={5} source={ImageSrc.orderCardBackground} style={styles.image} >

                    </ImageBackground>
                    <View style={styles.border}>
                    </View>
                </View>
                <TouchableOpacity disabled={disabled?.detail} onPress={onDetail} style={styles.content} >
                    <Typography numberOfLines={1} >{title}</Typography>
                    <Typography
                        style={{ color: "black", fontFamily: "Nunito-regular", marginTop: 5 }}
                        numberOfLines={2}
                        variant="subtitle" >
                        {subTitle}
                    </Typography>
                </TouchableOpacity>
                <TouchableOpacity onPress={onStatus} disabled={disabled?.status} style={[styles.status, currentStatusStyle]} >
                    <Typography numberOfLines={1} style={[{ marginHorizontal: 10 }, styles.text_color_black]} >
                        {currentStatus}
                    </Typography>
                </TouchableOpacity>
            </View>
        </Swipeable>
    )
}

export default OrderListItem;
