import React from 'react';
import { View, TextInput, StyleSheet, CheckBox as Radio } from 'react-native';
import Typography from '../Typography';

const styles = StyleSheet.create({
    container: {

        marginBottom: 10,
        marginTop: 10
    },
    inputStyleContainer: {
        flex: 1,
        height: 45,
        borderRadius: 10,
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

const CheckBox = (props) => {
    return (
        <View style={styles.container}>
            <Typography style={{ marginBottom: 20, fontSize: 14 }}>{props.label}</Typography>
            <View style={[styles.inputStyleContainer, props.style]}>
                <Radio {...props} />
            </View>
        </View>
    )
};

export default CheckBox;