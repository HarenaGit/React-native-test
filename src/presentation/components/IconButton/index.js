import React from 'react';
import { TouchableOpacity as Button, StyleSheet, View } from 'react-native';
import Typography from '../Typography';

const styles = StyleSheet.create({
    flat: {
        borderRadius: 10,
        borderColor: "rgba(0,0,0,0.2)",
        borderStyle: "solid",
        borderWidth: 1,
        width: 45,
        height: 45,
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
        fontSize: 15
    }
})

const IconButton = ({ children, variant = "flat", onPress = () => { }, style, disabled = false, badge = 0 }) => {

    const formatBadge = (numberForBadge) => {
        if (`${numberForBadge}`.length > 2) return "99+";
        return numberForBadge;
    }

    return (
        <Button disabled={disabled} style={[styles[variant], style]} onPress={onPress} >
            {badge !== 0 ?
                (<View style={styles.innerContainer}>
                    <Typography style={styles.badgeText}>
                        {formatBadge(badge)}
                    </Typography>
                </View>) : <></>}
            {children}
        </Button>
    )
}

export default IconButton;