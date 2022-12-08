import React from 'react'
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        height: 50,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 35
    }
});


const header = ({ RightComponent = () => (<></>), LeftComponent = () => (<></>) }) => {

    return (
        <View style={styles.container} >
            <LeftComponent />
            <RightComponent />
        </View>
    )
}

export default header;