import React from 'react'
import { View, StyleSheet } from 'react-native'
import Typography from '../Typography'

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        borderBottomColor: "rgba(0,0,0,0.2)",
        borderStyle: "solid",
        borderBottomWidth: 1,
        flexDirection: "row"
    },
    leftContainer: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: "#4eac6d",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20
    }
})

const NotificationItem = ({
    leftContainerColor = "#4eac6d",
    leftText = "", leftTextColor = "#ffffff",
    title = "", message = "", date = "", notificationType = "",
    notificationTypeColor = "#4eac6d"
}) => {

    return (
        <View style={styles.container} >
            <View style={[styles.leftContainer, { backgroundColor: leftContainerColor }]}>
                <Typography style={{ color: leftTextColor }}>{`${leftText}`.length === 0 ? "" : leftText[0]}</Typography>
            </View>
            <View style={{ paddingLeft: 0, flex: 1 }} >
                <Typography style={{ fontSize: 15 }} >{title}{` `}</Typography>
                <Typography style={{ fontSize: 15, marginTop: 5 }} variant="subTitle">{message}</Typography>
                <View style={{ paddingVertical: 20, flexDirection: "row", alignItems: "center" }}>
                    <Typography style={{ fontSize: 17, padding: 5, backgroundColor: notificationTypeColor, fontSize: 10, color: "#ffffff", borderRadius: 5 }}>{notificationType}</Typography>
                    <Typography style={{ marginLeft: 30, fontSize: 12 }} variant="subTitle">{date}</Typography>
                </View>
            </View>
        </View>
    )
}

export default NotificationItem;