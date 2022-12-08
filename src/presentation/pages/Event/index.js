import React from 'react';
import { View } from 'react-native';
import Header from '../../layouts/header.v.1';


const Event = () => {
    return (
        <View style={{ flex: 1 }}>
            <Header title="Events" includeSearch={true} onSearch={() => { }} />
        </View>
    );
}

export default Event;