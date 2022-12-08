import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';

import { useSelector } from 'react-redux';

import UserRole from '../../../data/constant/UserRole';
import Header from '../../layouts/header.v.1';
import Typography from '../../../presentation/components/Typography';
import ButtonList from '../../../presentation/components/ButtonList';

import Activity from './Activity';
import Statistic from './Statistic';

const Home = () => {

    const { roleName } = useSelector((state) => {
        return {
            roleName: state.auth.roleName
        }
    })

    const [currentView, setCurrentView] = useState(0);

    const onMenuButton = (id) => {
        setCurrentView(3);
        switch (id) {
            case 0:
                setCurrentView(0);
                break;
            case 1:
                setCurrentView(1);
                break;
            default:
                return;
        }
    }

    return (
        <View style={{ flex: 1, marginBottom: 75 }}>
            <Header />
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={{ marginTop: 20, marginHorizontal: 21 }} >
                    <Typography variant='title' style={{ color: "rgba(0,0,0,0.3)" }} numberOfLines={1} >Check your restaurant </Typography>
                    <Typography variant='bigTitle' numberOfLines={1} >The MadaMeals</Typography>
                </View>

                <View style={{ marginTop: 20, marginHorizontal: 21, marginBottom: 20 }} >
                    <ButtonList onPress={onMenuButton}
                        buttonList={
                            UserRole.ADMIN.name === roleName || UserRole.SUPER_ADMIN.name === roleName ?
                                [{ icon: "chart-line", title: "Activity" }, { icon: "chart-bar", title: "Statistic" }]
                                : [{ icon: "chart-line", title: "Activity" }]
                        } />
                </View>
                {currentView === 0 ? <Activity isActive={currentView === 0} /> : <Statistic isActive={currentView === 1} />}
            </ScrollView>
        </View>
    );
}

export default Home;