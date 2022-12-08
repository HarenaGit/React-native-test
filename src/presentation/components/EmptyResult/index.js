import React from 'react';

import { View } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import Typography from '../Typography';

const EmptyResult = ({ title = "", icon = "file-o" }) => {

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

            <FontAwesome
                name={icon}
                size={30}
                color={"rgba(0,0,0,0.2)"}
            >
            </FontAwesome>
            <Typography style={{ fontSize: 20, color: "rgba(0,0,0,0.2)", marginTop: 30 }} >{title}</Typography>

        </View>
    )
}

export default EmptyResult;