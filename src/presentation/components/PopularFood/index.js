import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import ImageSrc from '../../../data/constant/ImageSrc';
import Typography from '../Typography';

const styles = StyleSheet.create({
    container: {
        width: 150,
        height: 200,
        backgroundColor: "#ccc",
        borderColor: "#ccc",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 10,
        marginRight: 20,
        alignItems: "center",
        overflow: "hidden",

    },
    overlay: {
        height: '100%',
        width: '100%',
        position: "relative"
    },
    numberOfItems: {
        paddingHorizontal: 10,
        paddingVertical: 5,
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
        right: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#4eac6d",
    },
    info: {
        position: "absolute",
        bottom: 0,
        left: 10,
        width: 140,
        height: 70,
        marginRight: 10,
        justifyContent: "flex-end",
        marginBottom: 10
    },

})

const PopularFood = ({ numberOfOrders = "", foodName = "" }) => {
    return (
        <ImageBackground blurRadius={1} source={ImageSrc.popularFoodBackground} style={styles.container} >
            <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                style={styles.overlay}>
                <View style={[styles.numberOfItems]} >
                    <Typography style={{ fontSize: 20, color: "white" }} numberOfLines={1} >{numberOfOrders}</Typography>
                </View>

                <View style={styles.info}>
                    <Typography style={{ color: "white" }} numberOfLines={2} >{foodName}</Typography>
                </View>
            </LinearGradient>
        </ImageBackground>
    )
}

export default PopularFood;