import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Button from '../Button'

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        //  justifyContent: "space-around",
        borderRadius: 10
    }
})

const ButtonList = ({ buttonList = [], activeColor = "#4eac6d", backgroundColor = "#ccc", onPress = () => { } }) => {

    const [active, setActive] = useState(0);

    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>

            {(buttonList || []).map((value, index) => {
                return (
                    <Button
                        onPress={() => { setActive(index); onPress(index); }}
                        style={{ marginRight: 10 }} icon={value.icon} title={value.title}
                        variant={index === active ? "contained" : "outlined"}
                        color={index === active ? "#4eac6d" : "rgba(0,0,0,0.4)"}
                        key={`index-${index}`}
                    />
                )
            })}
        </ScrollView>
    );
}

export default ButtonList;