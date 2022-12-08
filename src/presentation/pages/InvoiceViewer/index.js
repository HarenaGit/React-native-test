import React from 'react';
import { View } from 'react-native';
import Header from '../../layouts/header.v.1';


const Invoice = () => {
    return (
        <View style={{ flex: 1 }}>
            <Header title="Invoice" includeSearch={true} onSearch={() => { }} />
        </View>
    );
}

export default Invoice;