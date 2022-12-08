import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Typography from '../Typography';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10,
        marginTop: 10
    },
    inputStyleContainer: {
        flex: 1,
        height: 45,
        borderRadius: 10,
        borderColor: "rgba(0,0,0,0.2)",
        borderStyle: "solid",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    inputStyle: {
        flex: 1,
        marginLeft: 20,
        height: 45,
        width: "100%"
    }
})

const Input = (props) => {
    return (
        <View style={[styles.container, props.style]}>
            <Typography style={{ marginBottom: 20, fontSize: 14 }}>{props.label}</Typography>
            <View style={[styles.inputStyleContainer]}>
                <TextInput {...props} style={[styles.inputStyle]} />
            </View>
        </View>
    )
};

export default Input;