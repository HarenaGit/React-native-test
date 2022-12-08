import React from 'react';
import { View, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import Typography from '../Typography';


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    containerStep: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

    },
    step: {
        borderRadius: 40,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center"
    }
})

const Stepper = ({ active, contents = [] }) => {

    const renderElements = () => {
        let element = [];

        (contents || []).map((content, index) => {
            element.push(
                <View key={`element-${index}`} style={{ alignItems: "center", opacity: active === index ? 1 : 0.2 }} >
                    <View key={`index-${index}`} style={[styles.step, { backgroundColor: `${content?.color}` }]}>
                        <Typography variant="subTitle" style={{ color: "#ffffff" }} >{index + 1}</Typography>
                    </View>
                    <View>
                        <Typography style={{ marginTop: 30 }} variant="subTitle" >{content?.title}</Typography>
                    </View>
                </View>)
            if (index < contents.length - 1) {
                element.push(
                    <View key={`elements-icon-${index}`} style={styles.step}>
                        <FontAwesome
                            name="arrow-right"
                            size={17}
                            color={'gray'}
                        ></FontAwesome>
                    </View>)
            }

        })
        return element;
    }

    return (
        <View style={styles.container}>
            {renderElements()}
        </View>
    )
}

export default Stepper;