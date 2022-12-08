import React from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity as Button } from 'react-native';
import Typography from '../Typography';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 170,
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6.0,
        elevation: 2,
    },
    titleContainer: {
        marginLeft: 20,
        marginTop: 20
    }
})

const Cart = ({ isLoading = false, value = 0, title = <></>, theme = "dark", onDetail = () => { } }) => {

    return (
        <View style={[styles.container, { backgroundColor: theme !== "dark" ? "#ffffff" : "#212529" }]}>
            <View style={styles.titleContainer} >
                {title}
            </View>
            <View style={styles.titleContainer}>
                {isLoading ? <ActivityIndicator size="small" color="#4eac6d" /> :
                    (<Button onPress={onDetail}>
                        <Typography variant='bigTitle' style={{ color: theme !== "dark" ? "#212529" : "#ffffff" }} numberOfLines={1} >{value}</Typography>
                    </Button>)
                }
            </View>
        </View>
    )
}

export default Cart;

