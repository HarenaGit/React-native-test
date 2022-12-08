import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    bigTitle: {
        fontFamily: "Nunito-Bold",
        fontSize: 50
    },
    title: {
        fontFamily: "Nunito-Bold",
        fontSize: 25
    },
    subTitle: {
        fontFamily: "Nunito-Bold",
        fontSize: 15,
        color: "rgba(0,0,0,0.5)"
    },
    paragraph: {

    }
});

const Typography = ({ children, variant = "title", style, numberOfLines }) => {

    return (
        <Text style={[styles[variant], style]} numberOfLines={numberOfLines} >
            {children}
        </Text>
    )
}

export default Typography;