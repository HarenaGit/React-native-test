import React from 'react';
import { View } from 'react-native';

import Header from '../../layouts/header.v.1';


const Stock = () => {
    return (
        <View style={{ flex: 1 }}>
            <Header title="Stock" includeSearch={true} onSearch={() => { }} />
        </View>
    );
}

export default Stock;