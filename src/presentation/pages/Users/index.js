import React from 'react';
import { View } from 'react-native';
import Header from '../../layouts/header.v.1';


const Users = () => {
    return (
        <View style={{ flex: 1 }}>
            <Header title="Users" includeSearch={true} onSearch={() => { }} />
        </View>
    );
}

export default Users;