import React from 'react'
import { TouchableOpacity as PrimitiveButton, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';


const Button = ({ disabled = false, title = "", icon = "", onPress = () => { }, style = {}, textStyle = {}, variant = "contained", color = "#4eac6d", isEndIcon = false, textColor = "white" }) => {

    const styles = StyleSheet.create({
        layout: {
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 10,
            flexDirection: "row"
        },
        outlined: {
            borderColor: color,
            borderWidth: 1,
            borderStyle: "solid"
        },
        contained: {
            backgroundColor: color
        },
        ml: {
            marginLeft: 10
        },
        noMl: {
            marginLeft: 0
        },
        opacity: {
            opacity: 0.3
        }
    });

    if (icon !== null) {
        return (
            <PrimitiveButton disabled={disabled} style={[styles.layout, style, styles[variant], disabled ? styles.opacity : {}]} onPress={onPress} >
                {icon.name !== "" && !isEndIcon ? <FontAwesome5
                    name={icon}
                    size={17}
                    color={variant === "contained" ? textColor : color}
                >
                </FontAwesome5> : <></>}
                <Text style={
                    [
                        { marginLeft: 10, fontFamily: "Nunito-regular", fontSize: 18, color: variant === "contained" ? textColor : color },
                        textStyle
                    ]} >{title}</Text>
                {icon.name !== "" && isEndIcon ? <View style={{ marginLeft: 10 }}>
                    <FontAwesome5
                        name={icon}
                        size={17}
                        color={variant === "contained" ? textColor : color}

                    >
                    </FontAwesome5>
                </View> : <></>}
            </PrimitiveButton>
        );
    } else {
        return (
            <PrimitiveButton disabled={disabled} style={[styles.layout, style, styles[variant], disabled ? styles.opacity : {}]} onPress={onPress} >
                <Text style={
                    [
                        textStyle,
                        { fontFamily: "Nunito-regular", fontSize: 18, color: variant === "contained" ? textColor : color }

                    ]} >{title}</Text>
            </PrimitiveButton>
        );
    }

}

export default Button;