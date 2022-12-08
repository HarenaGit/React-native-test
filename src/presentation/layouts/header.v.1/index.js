import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import BasicHeader from '../../components/BasicHeader';

const HeaderV1 = ({ title = "", includeSearch = false, onSearch = () => { } }) => {

    const navigation = useNavigation();

    const { numberOfNotification } = useSelector((state) => {
        return {
            numberOfNotification: state.notification.numberOfNotification
        }
    })

    const onMenu = () => {
        navigation.dispatch(DrawerActions.toggleDrawer());
    }

    const onNotification = () => {
        navigation.navigate("Notification");
    }


    return (
        <>
            <BasicHeader title={title}
                onLeftButtonPress={onMenu}
                onRightButtonPress={onNotification}
                LeftIcon={() => (
                    <FontAwesome5
                        name="bars"
                        size={17}
                        color={'rgba(0,0,0,0.8)'}
                    ></FontAwesome5>
                )}

                includeSearch={includeSearch}
                SearchIcon={() => (
                    <FontAwesome5
                        name="search"
                        size={17}
                        color={'rgba(0,0,0,0.8)'}
                    ></FontAwesome5>
                )}
                onSearch={onSearch}


                rightStyle={{ backgroundColor: "#4eac6d" }}

                rightBadge={numberOfNotification}

                RightIcon={() => (
                    <FontAwesome5
                        name="bell"
                        size={17}
                        color={'#fff'}
                    ></FontAwesome5>
                )}
            />
        </>
    )
}

export default HeaderV1;